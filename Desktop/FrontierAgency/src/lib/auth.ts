// Use Web Crypto API which works in both Node.js and Cloudflare Workers
const crypto = globalThis.crypto;
const subtle = crypto.subtle;
import type { User, SafeUser } from "./types";

const SESSION_DURATION_DAYS = 30;
const COOKIE_NAME = "frontier_session";

// These will be initialized by the caller with the actual database queries
let userQueries: ReturnType<typeof import("./db")["getDatabaseQueries"]>["userQueries"] | null = null;
let sessionQueries: ReturnType<typeof import("./db")["getDatabaseQueries"]>["sessionQueries"] | null = null;

// Initialize the database queries - this should be called once per request
export function initDbQueries(db: any) {
  const { userQueries: uq, sessionQueries: sq } = db;
  userQueries = uq;
  sessionQueries = sq;
}

/**
 * Ensure DB queries are available.
 * If they haven't been initialized via initDbQueries, resolve them from
 * the Cloudflare context automatically.
 */
async function ensureDbQueries() {
  if (userQueries && sessionQueries) return;

  const { getQueries } = await import("./db");
  const queries = await getQueries();
  userQueries = queries.userQueries;
  sessionQueries = queries.sessionQueries;
}

export function generateId(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// --- Password hashing with PBKDF2 (Web Crypto API compatible) ---

async function hashPasswordPBKDF2(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const passwordKey = await subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivedKey = await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    { name: "PBKDF2", length: 256 },
    false,
    ["deriveKey"]
  );

  const keyBuffer = await subtle.exportKey("raw", derivedKey);

  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const keyHex = Array.from(new Uint8Array(keyBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  return `${saltHex}:${keyHex}`;
}

async function verifyPasswordPBKDF2(password: string, hash: string): Promise<boolean> {
  try {
    const [saltHex, keyHex] = hash.split(":");
    if (!saltHex || !keyHex) return false;

    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const expectedKey = new Uint8Array(keyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

    const encoder = new TextEncoder();
    const passwordKey = await subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const derivedKey = await subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      passwordKey,
      { name: "PBKDF2", length: 256 },
      false,
      ["deriveKey"]
    );

    const keyBuffer = await subtle.exportKey("raw", derivedKey);
    const actualKey = new Uint8Array(keyBuffer);

    if (expectedKey.length !== actualKey.length) return false;

    let result = 0;
    for (let i = 0; i < expectedKey.length; i++) {
      result |= expectedKey[i] ^ actualKey[i];
    }
    return result === 0;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

export function hashPassword(password: string): Promise<string> {
  return hashPasswordPBKDF2(password);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return verifyPasswordPBKDF2(password, hash);
}

// --- Session management ---

export async function createSession(userId: string): Promise<{ sessionId: string; expiresAt: string }> {
  await ensureDbQueries();
  if (!sessionQueries) throw new Error("Database queries not initialized");

  const sessionId = generateId();
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  await sessionQueries.create
    .bind(sessionId, userId, expiresAt)
    .run();

  return { sessionId, expiresAt };
}

export async function getSession(requestHeaders: Headers): Promise<{ user: SafeUser } | null> {
  await ensureDbQueries();
  if (!sessionQueries || !userQueries) throw new Error("Database queries not initialized");

  const cookieHeader = requestHeaders.get("cookie") || "";
  const sessionIdMatch = cookieHeader.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  const sessionId = sessionIdMatch ? decodeURIComponent(sessionIdMatch[1]) : null;

  if (!sessionId) return null;

  // Delete expired sessions first
  await sessionQueries.deleteExpired.bind().run();

  // Find the session
  const sessionResult = await sessionQueries.findById.bind(sessionId).first();

  if (!sessionResult) return null;

  // Find the user
  const userResult = await userQueries.findById.bind(sessionResult.user_id).first();

  if (!userResult) return null;

  const { password_hash: _, ...safeUser } = userResult as unknown as User;
  return { user: safeUser };
}

export async function destroySession(): Promise<void> {
  // Cookie clearing is handled by the caller in the API route
}

// --- Input validation ---

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 128) return "Password must be less than 128 characters";
  return null;
}

export function validateName(name: string): string | null {
  if (name.trim().length < 1) return "Name is required";
  if (name.trim().length > 100) return "Name must be less than 100 characters";
  return null;
}

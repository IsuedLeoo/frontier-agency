import crypto from "crypto";
import { cookies } from "next/headers";
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

export function generateId(): string {
  return crypto.randomBytes(32).toString("hex");
}

// --- Password hashing with Node.js built-in scrypt ---

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(crypto.timingSafeEqual(Buffer.from(key, "hex"), derivedKey));
    });
  });
}

// --- Session management ---

export async function createSession(userId: string): Promise<string> {
  if (!sessionQueries) throw new Error("Database queries not initialized");

  const sessionId = generateId();
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  // D1 prepared statements need to be bound and executed
  const result = await sessionQueries.create
    .bind(sessionId, userId, expiresAt)
    .run();

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
  });

  return sessionId;
}

export async function getSession(): Promise<{ user: SafeUser } | null> {
  if (!sessionQueries || !userQueries) throw new Error("Database queries not initialized");

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionId) return null;

  // Delete expired sessions first
  await sessionQueries.deleteExpired.run();

  // Find the session
  const sessionResult = await sessionQueries.findById.bind(sessionId).first();

  if (!sessionResult) return null;

  // Find the user
  const userResult = await userQueries.findById.bind(sessionResult.user_id).first();

  if (!userResult) return null;

  const { password_hash: _, ...safeUser } = userResult as User;
  return { user: safeUser };
}

export async function destroySession(): Promise<void> {
  if (!sessionQueries) throw new Error("Database queries not initialized");

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (sessionId) {
    await sessionQueries.deleteById.bind(sessionId).run();
  }

  cookieStore.delete(COOKIE_NAME);
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
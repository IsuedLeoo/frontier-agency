import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SafeUser, UserRole } from "./types";
import { userQueries, sessionQueries, generateId } from "./db";
import { getDb } from "./db";

const SESSION_COOKIE = "fa_admin_session";
const SESSION_DAYS = 30;

// ─── Password Hashing (PBKDF2-SHA256, Cloudflare-compatible) ────────────────

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const keyBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const keyHex = Array.from(new Uint8Array(keyBits)).map(b => b.toString(16).padStart(2, "0")).join("");
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${keyHex}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, expectedKeyHex] = hash.split(":");
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const keyBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const keyHex = Array.from(new Uint8Array(keyBits)).map(b => b.toString(16).padStart(2, "0")).join("");
  if (keyHex.length !== expectedKeyHex.length) return false;
  let result = 0;
  for (let i = 0; i < keyHex.length; i++) {
    result |= keyHex.charCodeAt(i) ^ expectedKeyHex.charCodeAt(i);
  }
  return result === 0;
}

// ─── Session Management ──────────────────────────────────────────────────────

export async function createSession(userId: string): Promise<string> {
  const db = getDb();
  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await sessionQueries.create(db, sessionId, userId, expiresAt);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return sessionId;
}

export async function getSession(): Promise<SafeUser | null> {
  const db = getDb();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  await sessionQueries.deleteExpired(db);
  const session = await sessionQueries.findById(db, sessionId);
  if (!session) return null;

  const user = await userQueries.findById(db, session.user_id);
  if (!user || !user.is_active) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    is_active: !!user.is_active,
    created_at: user.created_at,
    created_by: user.created_by,
  };
}

export async function destroySession(): Promise<void> {
  const db = getDb();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await sessionQueries.delete(db, sessionId);
  }
  cookieStore.delete(SESSION_COOKIE);
}

// ─── Route Protection ────────────────────────────────────────────────────────

export async function requireAuth(allowedRoles?: UserRole[]): Promise<SafeUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") redirect("/");
    if (user.role === "staff") redirect("/");
    redirect("/login");
  }
  return user;
}

export async function requireAdmin(): Promise<SafeUser> {
  return requireAuth(["admin"]);
}

export async function requireStaff(): Promise<SafeUser> {
  return requireAuth(["admin", "staff"]);
}

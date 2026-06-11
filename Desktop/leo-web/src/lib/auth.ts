import crypto from "crypto";
import { cookies } from "next/headers";
import { userQueries, sessionQueries } from "./db";
import type { User, SafeUser } from "./types";

const SESSION_DURATION_DAYS = 30;
const COOKIE_NAME = "frontier_session";

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
  const sessionId = generateId();
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  sessionQueries.create.run(sessionId, userId, expiresAt);

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
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionId) return null;

  sessionQueries.deleteExpired.run();

  const session = sessionQueries.findById.get(sessionId) as
    | { user_id: string }
    | undefined;

  if (!session) return null;

  const user = userQueries.findById.get(session.user_id) as User | undefined;

  if (!user) return null;

  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;

  if (sessionId) {
    sessionQueries.deleteById.run(sessionId);
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

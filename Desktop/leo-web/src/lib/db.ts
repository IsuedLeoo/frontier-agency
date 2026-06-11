import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "frontier.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export const userQueries = {
  create: db.prepare(
    "INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)"
  ),
  findById: db.prepare("SELECT * FROM users WHERE id = ?"),
  findByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
  deleteById: db.prepare("DELETE FROM users WHERE id = ?"),
};

export const sessionQueries = {
  create: db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
  ),
  findById: db.prepare(
    "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')"
  ),
  deleteById: db.prepare("DELETE FROM sessions WHERE id = ?"),
  deleteByUserId: db.prepare("DELETE FROM sessions WHERE user_id = ?"),
  deleteExpired: db.prepare(
    "DELETE FROM sessions WHERE expires_at <= datetime('now')"
  ),
};

export default db;

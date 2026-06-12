// D1 Database Adapter
// This wraps the D1 binding to provide a similar interface to the old better-sqlite3 setup

import type { D1Database as CF_D1Database } from "@cloudflare/workers-types";

/**
 * Get the D1 database binding from the Cloudflare Worker environment.
 *
 * OpenNext's `populateProcessEnv` only copies **string** env vars into
 * `process.env`, so D1 bindings (which are objects) are missing.
 * The correct way to access them is via `getCloudflareContext().env`.
 */
export async function getD1Binding(): Promise<CF_D1Database> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const ctx = getCloudflareContext();
  const db = (ctx.env as Record<string, unknown>)["frontier_agency_db"] as CF_D1Database;
  if (!db) {
    throw new Error(
      "D1 binding 'frontier_agency_db' not found. " +
      "Make sure d1_databases is configured in wrangler.jsonc and the worker is deployed."
    );
  }
  return db;
}

interface DB {
  prepare(sql: string): DBStatement;
  pragma(command: string): void;
  exec(sql: string): void;
}

interface DBStatement {
  bind(...params: any[]): DBStatement;
  run(): { success: boolean; meta: { last_rowid: number; changes: number } };
  all(): any[];
  first(): any;
  get(): any;
  raw(): any;
}

const dbQueries = {
  // User queries
  userCreate:
    "INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)",
  userFindById: "SELECT * FROM users WHERE id = ?",
  userFindByEmail: "SELECT * FROM users WHERE email = ?",
  userDeleteById: "DELETE FROM users WHERE id = ?",

  // Session queries
  sessionCreate:
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
  sessionFindById:
    "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')",
  sessionDeleteById: "DELETE FROM sessions WHERE id = ?",
  sessionDeleteByUserId: "DELETE FROM sessions WHERE user_id = ?",
  sessionDeleteExpired:
    "DELETE FROM sessions WHERE expires_at <= datetime('now')",

  // Project queries
  projectCreate:
    "INSERT INTO projects (id, user_id, name, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  projectFindById: "SELECT * FROM projects WHERE id = ?",
  projectFindByUserId: "SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC",
  projectUpdate:
    "UPDATE projects SET name = ?, description = ?, status = ?, updated_at = ? WHERE id = ?",
  projectDeleteById: "DELETE FROM projects WHERE id = ?",

  // Project services queries
  projectServiceCreate:
    "INSERT INTO project_services (id, project_id, service_name, service_slug, status, config, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  projectServiceFindById: "SELECT * FROM project_services WHERE id = ?",
  projectServiceFindByProjectId:
    "SELECT * FROM project_services WHERE project_id = ? ORDER BY created_at DESC",
  projectServiceUpdateStatus:
    "UPDATE project_services SET status = ?, config = ? WHERE id = ?",
  projectServiceDeleteById: "DELETE FROM project_services WHERE id = ?",

  // Activity log queries
  activityLogCreate:
    "INSERT INTO activity_log (id, project_id, user_id, action, details, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  activityLogFindByProjectId:
    "SELECT * FROM activity_log WHERE project_id = ? ORDER BY created_at DESC LIMIT 50",

  // Integrations queries
  integrationCreate:
    "INSERT INTO integrations (id, user_id, project_id, provider, access_token, refresh_token, webhook_url, config, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  integrationFindById: "SELECT * FROM integrations WHERE id = ?",
  integrationFindByUserIdProvider:
    "SELECT * FROM integrations WHERE user_id = ? AND provider = ?",
  integrationFindByProjectIdProvider:
    "SELECT * FROM integrations WHERE project_id = ? AND provider = ?",
  integrationUpdateStatus:
    "UPDATE integrations SET status = ?, config = ? WHERE id = ?",
  integrationDeleteById: "DELETE FROM integrations WHERE id = ?",
};

export class D1Database {
  private db: CF_D1Database;

  constructor(db: CF_D1Database) {
    this.db = db;
  }

  // Helper to create a prepared statement
  prepare(sql: string) {
    return {
      bind: (...params: any[]) => {
        const stmt = this.db.prepare(sql);
        return {
          run: () => {
            return stmt.bind(...params).run();
          },
          all: () => {
            return stmt.bind(...params).all();
          },
          first: () => {
            const result = stmt.bind(...params).first();
            return result;
          },
          get: () => {
            return stmt.bind(...params).first();
          },
          raw: () => {
            return stmt.bind(...params).raw();
          }
        };
      }
    };
  }

  // Pragma commands (for compatibility)
  pragma(command: string) {
    // For journal_mode and foreign_keys, D1 handles this differently
    // In practice, D1 has WAL mode and foreign keys ON by default
    // We'll ignore these for compatibility
    if (command.includes('journal_mode = WAL') || command.includes('foreign_keys = ON')) {
      // No-op - D1 handles this appropriately
      return;
    }
    // For other pragmas, we could implement them if needed
    // For now, just log for debugging
    console.warn(`Pragma command ignored: ${command}`);
  }

  // Exec multiple statements (for schema creation)
  exec(sql: string) {
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    statements.forEach(statement => {
      try {
        this.db.prepare(statement).run();
      } catch (e) {
        // Some statements might fail if tables already exist
        // This is OK for schema migrations
        console.warn(`SQL execution warning: ${(e as any).message}`);
      }
    });
  }

  // Query helper methods that mimic the old interface
  userQueries = {
    create: this.prepare(dbQueries.userCreate),
    findById: this.prepare(dbQueries.userFindById),
    findByEmail: this.prepare(dbQueries.userFindByEmail),
    deleteById: this.prepare(dbQueries.userDeleteById),
  };

  sessionQueries = {
    create: this.prepare(dbQueries.sessionCreate),
    findById: this.prepare(dbQueries.sessionFindById),
    deleteById: this.prepare(dbQueries.sessionDeleteById),
    deleteByUserId: this.prepare(dbQueries.sessionDeleteByUserId),
    deleteExpired: this.prepare(dbQueries.sessionDeleteExpired),
  };

  projectQueries = {
    create: this.prepare(dbQueries.projectCreate),
    findById: this.prepare(dbQueries.projectFindById),
    findByUserId: this.prepare(dbQueries.projectFindByUserId),
    update: this.prepare(dbQueries.projectUpdate),
    deleteById: this.prepare(dbQueries.projectDeleteById),
  };

  projectServiceQueries = {
    create: this.prepare(dbQueries.projectServiceCreate),
    findById: this.prepare(dbQueries.projectServiceFindById),
    findByProjectId: this.prepare(dbQueries.projectServiceFindByProjectId),
    updateStatus: this.prepare(dbQueries.projectServiceUpdateStatus),
    deleteById: this.prepare(dbQueries.projectServiceDeleteById),
  };

  activityLogQueries = {
    create: this.prepare(dbQueries.activityLogCreate),
    findByProjectId: this.prepare(dbQueries.activityLogFindByProjectId),
  };

  integrationQueries = {
    create: this.prepare(dbQueries.integrationCreate),
    findById: this.prepare(dbQueries.integrationFindById),
    findByUserIdProvider: this.prepare(dbQueries.integrationFindByUserIdProvider),
    findByProjectIdProvider: this.prepare(dbQueries.integrationFindByProjectIdProvider),
    updateStatus: this.prepare(dbQueries.integrationUpdateStatus),
    deleteById: this.prepare(dbQueries.integrationDeleteById),
  };
}

// Initialize database - this will be called from middleware or API routes
export function initializeD1(db: CF_D1Database) {
  const database = new D1Database(db);

  // Create tables if they don't exist (run schema)
  const schema = `
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

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'discovery',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS project_services (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      service_slug TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      config TEXT DEFAULT '{}',
      created_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS integrations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      project_id TEXT,
      provider TEXT NOT NULL,
      access_token TEXT,
      refresh_token TEXT,
      webhook_url TEXT,
      config TEXT DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_project_services_project_id ON project_services(project_id);
    CREATE INDEX IF NOT EXISTS idx_project_services_status ON project_services(status);
    CREATE INDEX IF NOT EXISTS idx_activity_log_project_id ON activity_log(project_id);
    CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
    CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
    CREATE INDEX IF NOT EXISTS idx_integrations_project_id ON integrations(project_id);
    CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);
  `;

  database.exec(schema);

  return database;
}

// Convenience: get DB queries with the D1 binding resolved automatically
export async function getQueries() {
  const db = await getD1Binding();
  return getDatabaseQueries(db);
}

// For backward compatibility - export a function that returns the query objects
export function getDatabaseQueries(db: CF_D1Database) {
  const database = new D1Database(db);
  return {
    userQueries: database.userQueries,
    sessionQueries: database.sessionQueries,
    projectQueries: database.projectQueries,
    projectServiceQueries: database.projectServiceQueries,
    activityLogQueries: database.activityLogQueries,
    integrationQueries: database.integrationQueries,
  };
}

// For direct access to the raw D1 instance when needed
export function getRawD1(db: CF_D1Database) {
  return db;
}
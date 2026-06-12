export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: string;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

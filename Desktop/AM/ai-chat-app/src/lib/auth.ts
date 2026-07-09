export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

const USERS_KEY = "am_users";
const SESSION_KEY = "am_session";

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): User[] {
  return getItem<User[]>(USERS_KEY, []);
}

export function getSession(): User | null {
  return getItem<User | null>(SESSION_KEY, null);
}

export function signUp(
  name: string,
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already registered" };
  }
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: Date.now(),
  };
  users.push(user);
  setItem(USERS_KEY, users);
  localStorage.setItem(`am_password_${email}`, password);
  setItem(SESSION_KEY, user);
  return { success: true };
}

export function signIn(
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, error: "User not found" };
  const stored = localStorage.getItem(`am_password_${email}`);
  if (stored !== password) return { success: false, error: "Invalid password" };
  setItem(SESSION_KEY, user);
  return { success: true };
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function deleteAccount() {
  const session = getSession();
  if (!session) return;
  const users = getUsers().filter((u) => u.id !== session.id);
  setItem(USERS_KEY, users);
  localStorage.removeItem(`am_password_${session.email}`);
  localStorage.removeItem(SESSION_KEY);
}

export function updateUser(updates: Partial<Omit<User, "id" | "createdAt">>) {
  const session = getSession();
  if (!session) return;
  const updated = { ...session, ...updates };
  const users = getUsers().map((u) => (u.id === session.id ? updated : u));
  setItem(USERS_KEY, users);
  setItem(SESSION_KEY, updated);
}

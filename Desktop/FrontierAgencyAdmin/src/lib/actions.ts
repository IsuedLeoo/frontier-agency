"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword, createSession, destroySession } from "./auth";
import { getDb, userQueries, invoiceQueries, documentQueries, generateId, generateInvoiceNumber } from "./db";
import type { SafeUser, UserRole } from "./types";

// ─── Auth Actions ────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const db = getDb();
  const user = await userQueries.findByEmail(db, email);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function createUserAction(formData: FormData, createdBy: string) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "client") as UserRole;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const db = getDb();
  const existing = await userQueries.findByEmail(db, email);
  if (existing) {
    return { error: "A user with this email already exists." };
  }

  const id = generateId();
  const passwordHash = await hashPassword(password);
  await userQueries.create(db, { id, email, password_hash: passwordHash, name, role, created_by: createdBy });

  return { success: true };
}

export async function setUserRoleAction(userId: string, role: UserRole) {
  const db = getDb();
  await userQueries.updateRole(db, userId, role);
}

export async function setUserActiveAction(userId: string, isActive: boolean) {
  const db = getDb();
  await userQueries.setActive(db, userId, isActive);
}

// ─── Invoice Actions ─────────────────────────────────────────────────────────

export async function createInvoiceAction(formData: FormData, createdBy: string) {
  const db = getDb();
  const clientId = String(formData.get("client_id") || "");
  const amount = parseFloat(String(formData.get("amount") || "0"));
  const description = String(formData.get("description") || "").trim() || null;
  const serviceType = String(formData.get("service_type") || "").trim() || null;
  const dueDate = String(formData.get("due_date") || "").trim() || null;

  if (!clientId || !amount || amount <= 0) {
    return { error: "Client and valid amount are required." };
  }

  const count = await invoiceQueries.getNextNumber(db);
  const id = generateId();
  const invoiceNumber = generateInvoiceNumber(count?.count ?? 0);

  await invoiceQueries.create(db, {
    id,
    client_id: clientId,
    invoice_number: invoiceNumber,
    amount,
    currency: "USD",
    status: "draft",
    description,
    service_type: serviceType,
    due_date: dueDate,
    paid_date: null,
    created_by: createdBy,
  });

  return { success: true };
}

export async function updateInvoiceAction(invoiceId: string, status: string) {
  const db = getDb();
  const paidDate = status === "paid" ? new Date().toISOString().split("T")[0] : undefined;
  await invoiceQueries.updateStatus(db, invoiceId, status, paidDate);
}

// ─── Document Actions ────────────────────────────────────────────────────────

export async function updateDocumentAction(docId: string, content: string) {
  const db = getDb();
  await documentQueries.update(db, docId, content);
}

import { getSession } from "@/lib/auth";
import { getDb, crmClientsQueries, generateId } from "@/lib/db";
import type { CrmClient } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const status = searchParams.get("status");

  const db = getDb();

  let clients;
  if (status) {
    clients = await db.prepare("SELECT * FROM clients WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?").bind(status, limit, offset).all();
  } else {
    clients = await crmClientsQueries.listAll(db, limit, offset);
  }

  const total = await crmClientsQueries.countAll(db);

  return Response.json({ clients: clients.results ?? [], total: total?.count ?? 0, limit, offset });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Handle both JSON and form-encoded data
  const contentType = request.headers.get("content-type") ?? "";
  let body: Record<string, unknown>;

  if (contentType.includes("application/json")) {
    body = (await request.json()) as Record<string, unknown>;
  } else {
    const formData = await request.formData();
    body = {};
    formData.forEach((value, key) => { body[key] = value; });
  }

  const db = getDb();

  // If ID is provided, this is an update
  if (body.id) {
    const existing = await crmClientsQueries.findById(db, body.id as string);
    if (!existing) {
      return Response.json({ error: "Client not found" }, { status: 404 });
    }

    const updates: Partial<CrmClient> = {};
    if (body.name !== undefined) updates.name = body.name as string;
    if (body.email !== undefined) updates.email = (body.email as string) || null;
    if (body.phone !== undefined) updates.phone = (body.phone as string) || null;
    if (body.company !== undefined) updates.company = (body.company as string) || null;
    if (body.industry !== undefined) updates.industry = (body.industry as string) || null;
    if (body.website !== undefined) updates.website = (body.website as string) || null;
    if (body.status !== undefined) updates.status = body.status as "lead" | "qualified" | "customer" | "inactive";
    if (body.notes !== undefined) updates.notes = (body.notes as string) || null;

    const id = body.id as string;
    await crmClientsQueries.update(db, id, updates);
    const updated = await crmClientsQueries.findById(db, id);
    return Response.json({ client: updated });
  }

  // Otherwise, create new
  if (!body.name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const id = generateId();

  await crmClientsQueries.create(db, {
    id,
    name: body.name as string,
    email: (body.email as string) ?? null,
    phone: (body.phone as string) ?? null,
    company: (body.company as string) ?? null,
    industry: (body.industry as string) ?? null,
    website: (body.website as string) ?? null,
    status: (body.status as string) ?? "lead",
    source: (body.source as string) ?? "manual",
    assigned_to: (body.assigned_to as string) ?? null,
    notes: (body.notes as string) ?? null,
    business_description: (body.business_description as string) ?? null,
    service_type: (body.service_type as string) ?? null,
    monthly_retainer: body.monthly_retainer ? parseFloat(body.monthly_retainer as string) : null,
    contract_value: body.contract_value ? parseFloat(body.contract_value as string) : null,
    contract_start_date: (body.contract_start_date as string) ?? null,
    contract_end_date: (body.contract_end_date as string) ?? null,
    next_due_date: (body.next_due_date as string) ?? null,
    support_guarantee_end: (body.support_guarantee_end as string) ?? null,
    billing_email: (body.billing_email as string) ?? null,
    address: (body.address as string) ?? null,
    timezone: (body.timezone as string) ?? null,
    priority: (body.priority as string) ?? "medium",
  });

  const client = await crmClientsQueries.findById(db, id);
  return Response.json({ client }, { status: 201 });
}

import { getSession } from "@/lib/auth";
import { getDb, appointmentsQueries, generateId } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const upcoming = searchParams.get("upcoming");

  const db = getDb();

  let appointments;
  if (upcoming) {
    appointments = await appointmentsQueries.listUpcoming(db, 20);
  } else {
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
    appointments = await appointmentsQueries.listAll(db, limit);
  }

  const total = await appointmentsQueries.countAll(db);

  return Response.json({ appointments: appointments.results ?? [], total: total?.count ?? 0 });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    client_id?: string;
    title?: string;
    description?: string;
    scheduled_at?: string;
    duration_minutes?: number;
    notes?: string;
  };

  if (!body.client_id || !body.title || !body.scheduled_at) {
    return Response.json({ error: "client_id, title, and scheduled_at are required" }, { status: 400 });
  }

  const db = getDb();
  const id = generateId();

  await appointmentsQueries.create(db, {
    id,
    client_id: body.client_id,
    title: body.title,
    description: body.description ?? null,
    scheduled_at: body.scheduled_at,
    duration_minutes: body.duration_minutes ?? 30,
    status: "scheduled",
    notes: body.notes ?? null,
    created_by: user.id,
    source: "manual",
  });

  const appointment = await appointmentsQueries.findById(db, id);
  return Response.json({ appointment }, { status: 201 });
}

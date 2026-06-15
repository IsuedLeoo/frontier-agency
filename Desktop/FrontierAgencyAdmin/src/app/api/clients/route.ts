import { getDb, userQueries } from "@/lib/db";
import { requireStaff } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireStaff();
  const db = getDb();
  const result = await userQueries.findByRole(db, "client");
  const clients = (result.results ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    email: c.email,
  }));
  return Response.json({ clients });
}

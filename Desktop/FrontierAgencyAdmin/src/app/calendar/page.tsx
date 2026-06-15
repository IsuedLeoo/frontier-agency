import { requireAdmin } from "@/lib/auth";
import { getDb, appointmentsQueries, crmClientsQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import CalendarClientPage from "./CalendarClientPage";

export const dynamic = "force-dynamic";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await requireAdmin();
  const db = getDb();
  const params = await searchParams;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const year = parseInt(String(params.year || currentYear));
  const month = parseInt(String(params.month || currentMonth));

  const safeYear = isNaN(year) ? currentYear : year;
  const safeMonth = isNaN(month) ? currentMonth : Math.max(0, Math.min(11, month));

  const daysInMonth = new Date(safeYear, safeMonth + 1, 0).getDate();

  // Fetch appointments for this month
  const monthStart = `${safeYear}-${String(safeMonth + 1).padStart(2, "0")}-01`;
  const monthEnd = `${safeYear}-${String(safeMonth + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

  const allAppts = await appointmentsQueries.listAll(db, 200);
  const appointments = ((allAppts.results ?? []) as any[]).filter((a) => {
    const d = a.scheduled_at?.substring(0, 10);
    return d >= monthStart && d <= monthEnd;
  });

  // Get client names for appointments
  const clientIds = [...new Set(appointments.map((a: any) => a.client_id).filter(Boolean))];
  const clientNames: Record<string, string> = {};
  for (const cid of clientIds) {
    const c = await crmClientsQueries.findById(db, cid);
    if (c) clientNames[c.id] = c.name;
  }

  // Get all clients for the dropdown search
  const allClientsRes = await crmClientsQueries.listAll(db, 100);
  const allClients = (allClientsRes.results ?? []) as any[];

  return (
    <AdminShell user={user}>
      <CalendarClientPage
        user={user}
        year={safeYear}
        month={safeMonth}
        appointments={appointments}
        clientNames={clientNames}
        clients={allClients}
      />
    </AdminShell>
  );
}

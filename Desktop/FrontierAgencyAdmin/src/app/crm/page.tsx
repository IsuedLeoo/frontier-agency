import { requireAdmin } from "@/lib/auth";
import { getDb, crmClientsQueries, clientNotesQueries, appointmentsQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import CrmClientPage from "./CrmClientPage";

export const dynamic = "force-dynamic";

export default async function CrmPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await requireAdmin();
  const db = getDb();
  const params = await searchParams;
  const search = String(params.search || "").toLowerCase();
  const status = String(params.status || "");

  const limit = 50;
  const clientsRes = await crmClientsQueries.listAll(db, limit, 0);
  let clients = clientsRes.results ?? [];

  if (status) {
    clients = clients.filter((c) => c.status === status);
  }

  if (search) {
    clients = clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(search) ||
        c.company?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        c.phone?.toLowerCase().includes(search)
    );
  }

  const clientsWithCounts = await Promise.all(
    clients.map(async (c) => {
      const notes = await clientNotesQueries.findByClient(db, c.id);
      const appts = await appointmentsQueries.findByClient(db, c.id);
      return {
        ...c,
        note_count: (notes.results ?? []).length,
        appointment_count: (appts.results ?? []).length,
      };
    })
  );

  const total = await crmClientsQueries.countAll(db);
  const leadCount = (await crmClientsQueries.countByStatus(db, "lead"))?.count ?? 0;
  const qualifiedCount = (await crmClientsQueries.countByStatus(db, "qualified"))?.count ?? 0;
  const customerCount = (await crmClientsQueries.countByStatus(db, "customer"))?.count ?? 0;

  return (
    <AdminShell user={user}>
      <CrmClientPage
        user={user}
        clients={clientsWithCounts}
        total={total?.count ?? 0}
        leadCount={leadCount}
        qualifiedCount={qualifiedCount}
        customerCount={customerCount}
        search={search}
        status={status}
      />
    </AdminShell>
  );
}

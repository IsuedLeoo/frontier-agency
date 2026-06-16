import { requireAdmin } from "@/lib/auth";
import { getDb, crmClientsQueries, clientNotesQueries, appointmentsQueries } from "@/lib/db";
import AdminShell from "@/components/AdminShell";
import { notFound } from "next/navigation";
import ClientDetailClientPage from "./ClientDetailClientPage";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  const db = getDb();
  const { id } = await params;

  const client = await crmClientsQueries.findById(db, id);
  if (!client) notFound();

  const notesRes = await clientNotesQueries.findByClient(db, id);
  const notes = notesRes.results ?? [];

  const apptsRes = await appointmentsQueries.findByClient(db, id);
  const appointments = apptsRes.results ?? [];

  return (
    <AdminShell user={user}>
      <ClientDetailClientPage
        user={user}
        client={client}
        notes={notes}
        appointments={appointments}
      />
    </AdminShell>
  );
}

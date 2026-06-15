import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/AdminShell";
import VoiceConfigClient from "./VoiceConfigClient";

export const dynamic = "force-dynamic";

export default async function VoicePage() {
  const user = await requireAdmin();

  return (
    <AdminShell user={user}>
      <VoiceConfigClient />
    </AdminShell>
  );
}

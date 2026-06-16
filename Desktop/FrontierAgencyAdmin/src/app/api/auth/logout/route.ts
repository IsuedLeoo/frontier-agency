import { logoutAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

export async function POST() {
  return logoutAction();
}

import { updateInvoiceAction } from "@/lib/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const invoiceId = String(formData.get("invoice_id") || "");
  const status = String(formData.get("status") || "");

  if (invoiceId && status) {
    await updateInvoiceAction(invoiceId, status);
  }

  redirect("/invoices");
}

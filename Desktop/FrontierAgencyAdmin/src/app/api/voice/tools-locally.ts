/**
 * Local tool execution — shared between /api/voice/tools and /api/voice/inbound
 */
import { getDb, crmClientsQueries, appointmentsQueries, clientNotesQueries, serviceDocsQueries, generateId } from "@/lib/db";
import type { CrmClient, Appointment } from "@/lib/types";

export interface VapiToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export async function executeToolLocally(
  toolCall: VapiToolCall,
  db: any,
  phoneNumber?: string | null
): Promise<unknown> {
  const { id: _toolCallId, name: functionName, arguments: args } = toolCall;
  let result: Record<string, unknown> = {};

  try {
    switch (functionName) {
      case "find_client": {
        const phone = (args?.phone as string) ?? phoneNumber;
        if (phone) {
          const client = await crmClientsQueries.findByPhone(db, phone);
          if (client) {
            result = {
              found: true,
              client: {
                id: client.id, name: client.name, email: client.email,
                phone: client.phone, company: client.company,
                industry: client.industry, website: client.website,
                status: client.status, notes: client.notes,
              },
            };
          } else {
            result = { found: false, message: "No client found with this phone number" };
          }
        } else {
          result = { found: false, message: "No phone number provided" };
        }
        break;
      }

      case "create_client": {
        const id = generateId();
        const name = (args?.name as string) ?? "Unknown Caller";
        await crmClientsQueries.create(db, {
          id, name,
          email: (args?.email as string) ?? null,
          phone: (args?.phone as string) ?? (phoneNumber ?? null),
          company: (args?.company as string) ?? null,
          industry: (args?.industry as string) ?? null,
          website: (args?.website as string) ?? null,
          status: "lead", source: "voice_agent", assigned_to: null,
          notes: (args?.notes as string) ?? null,
          business_description: (args?.business_description as string) ?? null,
          service_type: (args?.service_type as string) ?? null,
        });
        result = { success: true, client_id: id, message: `Client ${name} has been added to the CRM as a lead.` };
        break;
      }

      case "update_client": {
        const clientId = args?.client_id as string;
        if (!clientId) { result = { success: false, message: "client_id is required" }; break; }
        const updates: Partial<CrmClient> = {};
        if (args?.name) updates.name = args.name as string;
        if (args?.email !== undefined) updates.email = (args.email as string) || null;
        if (args?.phone !== undefined) updates.phone = (args.phone as string) || null;
        if (args?.company !== undefined) updates.company = (args.company as string) || null;
        if (args?.status) updates.status = args.status as CrmClient["status"];
        if (args?.notes !== undefined) updates.notes = (args.notes as string) || null;
        if (args?.business_description !== undefined) updates.business_description = (args.business_description as string) || null;
        if (args?.service_type !== undefined) updates.service_type = (args.service_type as string) || null;
        if (args?.monthly_retainer !== undefined) updates.monthly_retainer = args.monthly_retainer ? Number(args.monthly_retainer) : null;
        if (args?.contract_value !== undefined) updates.contract_value = args.contract_value ? Number(args.contract_value) : null;
        if (args?.priority) updates.priority = args.priority as CrmClient["priority"];
        await crmClientsQueries.update(db, clientId, updates);
        result = { success: true, message: `Client updated. Changed: ${Object.keys(updates).join(", ")}` };
        break;
      }

      case "add_client_note": {
        const clientId = args?.client_id as string;
        const content = args?.content as string;
        const type = (args?.type as string) ?? "voice_call";
        const phone = (args?.phone as string) ?? phoneNumber;
        if (!content) { result = { success: false, message: "content is required" }; break; }
        let resolvedClientId = clientId;
        if (!resolvedClientId) {
          if (phone) {
            const existing = await crmClientsQueries.findByPhone(db, phone);
            if (existing) resolvedClientId = existing.id;
          }
          if (!resolvedClientId) {
            resolvedClientId = generateId();
            await crmClientsQueries.create(db, {
              id: resolvedClientId, name: "Call from " + (phone ?? "unknown"),
              email: null, phone, company: null, industry: null, website: null,
              status: "lead", source: "voice_agent", assigned_to: null, notes: null,
              business_description: null, service_type: null,
            });
          }
        }
        const noteId = generateId();
        await clientNotesQueries.create(db, { id: noteId, client_id: resolvedClientId, type, content, created_by: "voice_agent" });
        result = { success: true, note_id: noteId, message: "Note added to client record" };
        break;
      }

      case "schedule_appointment": {
        const clientId = args?.client_id as string;
        const phone = (args?.phone as string) ?? phoneNumber;
        const title = (args?.title as string) ?? "Consultation Call";
        const scheduledAt = args?.scheduled_at as string;
        const durationMinutes = (args?.duration_minutes as number) ?? 30;
        if (!scheduledAt) { result = { success: false, message: "scheduled_at is required. Ask the caller for their preferred date and time." }; break; }
        let resolvedClientId = clientId;
        if (!resolvedClientId) {
          if (phone) {
            const existing = await crmClientsQueries.findByPhone(db, phone);
            if (existing) resolvedClientId = existing.id;
          }
          if (!resolvedClientId) {
            resolvedClientId = generateId();
            const name = (args?.client_name as string) ?? "Call from " + (phone ?? "unknown");
            await crmClientsQueries.create(db, {
              id: resolvedClientId, name, email: (args?.client_email as string) ?? null, phone,
              company: null, industry: null, website: null,
              status: "lead", source: "voice_agent", assigned_to: null, notes: null,
              business_description: null, service_type: null,
            });
          }
        }
        const appointmentId = generateId();
        await appointmentsQueries.create(db, {
          id: appointmentId, client_id: resolvedClientId, title,
          description: (args?.description as string) ?? null,
          scheduled_at: scheduledAt, duration_minutes: durationMinutes,
          status: "scheduled", notes: (args?.notes as string) ?? null,
          created_by: "voice_agent", source: "voice_agent",
        });
        result = { success: true, appointment_id: appointmentId, client_id: resolvedClientId, message: `Appointment "${title}" scheduled for ${scheduledAt}.` };
        break;
      }

      case "find_appointments": {
        const clientId = args?.client_id as string;
        if (!clientId) { result = { success: false, message: "client_id is required" }; break; }
        const appointments = await appointmentsQueries.findByClient(db, clientId);
        const apptList = (appointments.results ?? []).map((a: any) => ({
          id: a.id, title: a.title, scheduled_at: a.scheduled_at,
          duration_minutes: a.duration_minutes, status: a.status,
        }));
        result = { success: true, count: apptList.length, appointments: apptList, message: `Found ${apptList.length} appointment(s).` };
        break;
      }

      case "update_appointment": {
        const appointmentId = args?.appointment_id as string;
        if (!appointmentId) { result = { success: false, message: "appointment_id is required" }; break; }
        const updates: Partial<Appointment> = {};
        if (args?.title) updates.title = args.title as string;
        if (args?.description !== undefined) updates.description = (args.description as string) || null;
        if (args?.scheduled_at) updates.scheduled_at = args.scheduled_at as string;
        if (args?.duration_minutes) updates.duration_minutes = Number(args.duration_minutes);
        if (args?.status) updates.status = args.status as Appointment["status"];
        if (args?.notes !== undefined) updates.notes = (args.notes as string) || null;
        if (Object.keys(updates).length === 0) { result = { success: false, message: "No fields to update" }; break; }
        await appointmentsQueries.update(db, appointmentId, updates);
        result = { success: true, message: `Appointment updated. Changed: ${Object.keys(updates).join(", ")}` };
        break;
      }

      case "cancel_appointment": {
        const appointmentId = args?.appointment_id as string;
        if (!appointmentId) { result = { success: false, message: "appointment_id is required" }; break; }
        await appointmentsQueries.updateStatus(db, appointmentId, "cancelled");
        result = { success: true, message: "Appointment has been cancelled." };
        break;
      }

      case "find_notes": {
        const clientId = args?.client_id as string;
        if (!clientId) { result = { success: false, message: "client_id is required" }; break; }
        const notes = await clientNotesQueries.findByClient(db, clientId);
        const noteList = (notes.results ?? []).map((n: any) => ({
          id: n.id, type: n.type, content: n.content, created_at: n.created_at,
        }));
        result = { success: true, count: noteList.length, notes: noteList };
        break;
      }

      case "search_docs": {
        const query = args?.query as string;
        if (!query) { result = { success: false, message: "query is required" }; break; }
        const docs = await serviceDocsQueries.search(db, query);
        const searchResults = (docs.results ?? []).map((d: any) => ({
          title: d.title, slug: d.slug, category: d.category,
          content: d.content.substring(0, 500),
        }));
        result = { success: true, count: searchResults.length, docs: searchResults };
        break;
      }

      case "get_doc": {
        const slug = args?.slug as string;
        if (!slug) { result = { success: false, message: "slug is required" }; break; }
        const doc = await serviceDocsQueries.findBySlug(db, slug);
        if (doc) {
          result = { success: true, doc: { title: doc.title, content: doc.content } };
        } else {
          result = { success: false, message: "Document not found" };
        }
        break;
      }

      case "transfer_call": {
        const transferNumber = (args?.phone_number as string) ?? "";
        if (!transferNumber) {
          result = { success: false, message: "No transfer number configured. Please provide a phone_number." };
        } else {
          result = { success: true, transfer_number: transferNumber, message: `Transferring call to ${transferNumber}.` };
        }
        break;
      }

      default:
        result = { success: false, message: `Unknown function: ${functionName}` };
    }
  } catch (toolErr: any) {
    // Vapi tool execution error
    result = { success: false, message: `Error: ${toolErr.message ?? "Unknown error"}` };
  }

  // Tool executed
  return result;
}

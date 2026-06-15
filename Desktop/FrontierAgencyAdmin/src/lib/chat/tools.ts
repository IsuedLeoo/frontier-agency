import type { D1Database } from "@cloudflare/workers-types";
import type { ToolDefinition, ToolCall } from "./types";

import { crmClientsQueries, userQueries, invoiceQueries, documentQueries, projectQueries, appointmentsQueries, clientNotesQueries, generateId, generateInvoiceNumber } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// ─── Tool Definitions ────────────────────────────────────────────────────────

export function getToolDefinitions(): ToolDefinition[] {
  return [
    // ── Client CRM Tools ──
    {
      type: "function",
      function: {
        name: "list_clients",
        description: "List all clients in the CRM. Supports optional filters.",
        parameters: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["lead", "qualified", "customer", "inactive"], description: "Filter by client status" },
            priority: { type: "string", enum: ["low", "medium", "high", "vip"], description: "Filter by priority" },
            search: { type: "string", description: "Search by name, email, or company" },
          },
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_client",
        description: "Get a full client profile by ID including all CRM fields: business info, billing, dates, contact, priority, service type, contract value, monthly retainer, support guarantee, appointments, and notes.",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "The client's unique CRM ID" },
          },
          required: ["client_id"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "create_client",
        description: "Create a new client in the CRM. Name is required. All other fields are optional. Returns the created client with its new ID. Use this for requests like 'create a client John Doe at Acme Inc with email john@acme.com', 'add a new client company XYZ', etc.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Full name or contact name of the client (required)" },
            email: { type: "string", description: "Email address" },
            phone: { type: "string", description: "Phone number" },
            company: { type: "string", description: "Company or business name" },
            industry: { type: "string", description: "Industry (e.g. Technology, Healthcare, Real Estate)" },
            website: { type: "string", description: "Company website URL" },
            business_description: { type: "string", description: "What the client's business does" },
            service_type: { type: "string", description: "Service they want: AI Receptionist, Email Automation, AI Booking System, Competitor Research, Lead Follow-Up, or Custom AI Solutions" },
            monthly_retainer: { type: "number", description: "Monthly payment amount in USD" },
            contract_value: { type: "number", description: "Total contract value in USD" },
            contract_start_date: { type: "string", description: "Contract start date in YYYY-MM-DD format" },
            contract_end_date: { type: "string", description: "Contract end date in YYYY-MM-DD format" },
            next_due_date: { type: "string", description: "Next service/task due date in YYYY-MM-DD" },
            support_guarantee_end: { type: "string", description: "Support guarantee expiration date in YYYY-MM-DD" },
            billing_email: { type: "string", description: "Billing contact email" },
            address: { type: "string", description: "Physical address" },
            timezone: { type: "string", description: "Timezone (e.g. America/New_York)" },
            priority: { type: "string", enum: ["low", "medium", "high", "vip"], description: "Client priority level" },
            notes: { type: "string", description: "Internal notes about the client" },
            source: { type: "string", enum: ["manual", "web", "referral", "voice_agent"], description: "How the client was acquired" },
          },
          required: ["name"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_client",
        description: "Update any field(s) on an existing CRM client. Only include the fields you want to change. The client_id is required.",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "The client's unique CRM ID (required)" },
            name: { type: "string", description: "Full name" },
            email: { type: "string", description: "Email address" },
            phone: { type: "string", description: "Phone number" },
            company: { type: "string", description: "Company name" },
            industry: { type: "string", description: "Industry" },
            website: { type: "string", description: "Website URL" },
            business_description: { type: "string", description: "What the business does" },
            service_type: { type: "string", description: "Service they want" },
            monthly_retainer: { type: "number", description: "Monthly retainer in USD" },
            contract_value: { type: "number", description: "Total contract value in USD" },
            contract_start_date: { type: "string", description: "Contract start YYYY-MM-DD" },
            contract_end_date: { type: "string", description: "Contract end YYYY-MM-DD" },
            next_due_date: { type: "string", description: "Next due date YYYY-MM-DD" },
            support_guarantee_end: { type: "string", description: "Support guarantee end YYYY-MM-DD" },
            billing_email: { type: "string", description: "Billing email" },
            address: { type: "string", description: "Address" },
            timezone: { type: "string", description: "Timezone" },
            priority: { type: "string", enum: ["low", "medium", "high", "vip"] },
            status: { type: "string", enum: ["lead", "qualified", "customer", "inactive"] },
            notes: { type: "string", description: "Internal notes" },
          },
          required: ["client_id"],
        },
      },
    },
    // ── Notes Tools ──
    {
      type: "function",
      function: {
        name: "add_client_note",
        description: "Add a note or interaction log entry to a client. Types: note, call, email, meeting, voice_call.",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "The client's CRM ID (required)" },
            type: { type: "string", enum: ["note", "call", "email", "meeting", "voice_call"], description: "Type of interaction" },
            content: { type: "string", description: "The note content or call summary (required)" },
          },
          required: ["client_id", "content"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "list_client_notes",
        description: "List all notes/interactions for a specific client, or all recent notes across all clients.",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "Filter by specific client ID" },
          },
          required: [],
        },
      },
    },
    // ── Appointment Tools ──
    {
      type: "function",
      function: {
        name: "schedule_appointment",
        description: "Schedule an appointment for a client. scheduled_at should be in ISO 8601 format (e.g. 2026-03-15T14:00:00).",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "The client's CRM ID (required)" },
            title: { type: "string", description: "Appointment title (required)" },
            scheduled_at: { type: "string", description: "Date and time in ISO 8601 format (required)" },
            duration_minutes: { type: "number", description: "Duration in minutes (default 30)" },
            description: { type: "string", description: "Description or agenda" },
            source: { type: "string", enum: ["manual", "voice_agent", "web"], description: "How the appointment was created" },
          },
          required: ["client_id", "title", "scheduled_at"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "list_appointments",
        description: "List appointments. Can filter by client, status (scheduled/completed/cancelled/no_show), or upcoming only.",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "Filter by client ID" },
            status: { type: "string", enum: ["scheduled", "completed", "cancelled", "no_show"], description: "Filter by status" },
            upcoming: { type: "boolean", description: "Only show future scheduled appointments" },
          },
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_appointment",
        description: "Update an appointment's status, title, or time.",
        parameters: {
          type: "object",
          properties: {
            appointment_id: { type: "string", description: "The appointment ID (required)" },
            status: { type: "string", enum: ["scheduled", "completed", "cancelled", "no_show"] },
            title: { type: "string", description: "New title" },
            scheduled_at: { type: "string", description: "New date/time in ISO 8601" },
          },
          required: ["appointment_id"],
        },
      },
    },
    // ── Invoice Tools ──
    {
      type: "function",
      function: {
        name: "list_invoices",
        description: "List invoices. Can filter by client_id and/or status.",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "Filter by client ID" },
            status: { type: "string", enum: ["draft", "sent", "paid", "overdue", "cancelled"], description: "Filter by invoice status" },
          },
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "create_invoice",
        description: "Create a new invoice for a client. Amount is in USD. Invoice is created as 'draft' by default.",
        parameters: {
          type: "object",
          properties: {
            client_id: { type: "string", description: "The client ID to invoice (required)" },
            amount: { type: "number", description: "Invoice amount in USD (required)" },
            description: { type: "string", description: "Description of what the invoice is for" },
            service_type: { type: "string", description: "Type of service" },
            due_date: { type: "string", description: "Due date in YYYY-MM-DD format" },
          },
          required: ["client_id", "amount"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_invoice_status",
        description: "Update the status of an invoice.",
        parameters: {
          type: "object",
          properties: {
            invoice_id: { type: "string", description: "The invoice's unique ID (required)" },
            status: { type: "string", enum: ["draft", "sent", "paid", "overdue", "cancelled"], description: "New status (required)" },
          },
          required: ["invoice_id", "status"],
        },
      },
    },
    // ── Staff Tools ──
    {
      type: "function",
      function: {
        name: "list_staff",
        description: "List all staff members (admin and staff roles)",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
    {
      type: "function",
      function: {
        name: "create_staff",
        description: "Create a new staff member account. Returns the created staff details including a temporary password.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Full name (required)" },
            email: { type: "string", description: "Email address (required)" },
            role: { type: "string", enum: ["admin", "staff"], description: "Role — must be 'admin' or 'staff' (required)" },
          },
          required: ["name", "email", "role"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "deactivate_staff",
        description: "Deactivate a staff member so they can no longer log in.",
        parameters: {
          type: "object",
          properties: {
            staff_id: { type: "string", description: "The staff member's unique ID (required)" },
          },
          required: ["staff_id"],
        },
      },
    },
    // ── Document Tools ──
    {
      type: "function",
      function: {
        name: "list_documents",
        description: "List all documents in the storage vault, optionally filtered by category",
        parameters: {
          type: "object",
          properties: {
            category: { type: "string", enum: ["handbook", "intelligence", "contracts", "reports", "other"], description: "Optional category filter" },
          },
          required: [],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_document",
        description: "Get the full content of a specific document by its ID",
        parameters: {
          type: "object",
          properties: {
            document_id: { type: "string", description: "The document's unique ID (required)" },
          },
          required: ["document_id"],
        },
      },
    },
    // ── Dashboard ──
    {
      type: "function",
      function: {
        name: "get_dashboard_stats",
        description: "Get dashboard statistics: total clients, staff, monthly revenue, outstanding invoices, active projects",
        parameters: { type: "object", properties: {}, required: [] },
      },
    },
  ];
}

// ─── Tool Executor ────────────────────────────────────────────────────────────

export async function executeTool(
  toolCall: ToolCall,
  db: D1Database,
  actingUserId: string
): Promise<unknown> {
  const name = toolCall.function.name;
  const args: Record<string, unknown> = JSON.parse(toolCall.function.arguments);

  switch (name) {
    case "list_clients": {
      const result = await crmClientsQueries.listAll(db);
      let clients = (result.results ?? []) as any[];

      if (args.status) {
        clients = clients.filter((c) => c.status === args.status);
      }
      if (args.priority) {
        clients = clients.filter((c) => c.priority === args.priority);
      }
      if (args.search) {
        const s = String(args.search).toLowerCase();
        clients = clients.filter(
          (c) =>
            c.name.toLowerCase().includes(s) ||
            (c.email && c.email.toLowerCase().includes(s)) ||
            (c.company && c.company.toLowerCase().includes(s))
        );
      }

      return {
        clients: clients.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          company: c.company,
          industry: c.industry,
          status: c.status,
          priority: c.priority,
          service_type: c.service_type,
          monthly_retainer: c.monthly_retainer,
          contract_value: c.contract_value,
          contract_end_date: c.contract_end_date,
          support_guarantee_end: c.support_guarantee_end,
          created_at: c.created_at,
        })),
        count: clients.length,
      };
    }

    case "get_client": {
      const client = await crmClientsQueries.getFullProfile(db, String(args.client_id));
      if (!client) return { error: "Client not found" };

      // Fetch related data
      const [invoicesRes, appointmentsRes, notesRes] = await Promise.all([
        invoiceQueries.findByClient(db, client.id),
        appointmentsQueries.findByClient(db, client.id),
        clientNotesQueries.findByClient(db, client.id),
      ]);

      const invoiceList = (invoicesRes.results ?? []) as any[];
      const appointmentList = (appointmentsRes.results ?? []) as any[];
      const noteList = (notesRes.results ?? []) as any[];

      const totalInvoiced = invoiceList.reduce((s, i) => s + (i.amount || 0), 0);
      const totalPaid = invoiceList.filter((i) => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);

      return {
        client,
        invoices: invoiceList,
        appointments: appointmentList,
        notes: noteList,
        stats: {
          total_invoiced: totalInvoiced,
          total_paid: totalPaid,
          invoice_count: invoiceList.length,
          appointment_count: appointmentList.length,
          note_count: noteList.length,
        },
      };
    }

    case "create_client": {
      const id = generateId();
      await crmClientsQueries.create(db, {
        id,
        name: String(args.name),
        email: args.email ? String(args.email) : null,
        phone: args.phone ? String(args.phone) : null,
        company: args.company ? String(args.company) : null,
        industry: args.industry ? String(args.industry) : null,
        website: args.website ? String(args.website) : null,
        status: args.status ? String(args.status) : "lead",
        source: args.source ? String(args.source) : "manual",
        assigned_to: null,
        notes: args.notes ? String(args.notes) : null,
        business_description: args.business_description ? String(args.business_description) : null,
        service_type: args.service_type ? String(args.service_type) : null,
        monthly_retainer: args.monthly_retainer ? Number(args.monthly_retainer) : null,
        contract_value: args.contract_value ? Number(args.contract_value) : null,
        contract_start_date: args.contract_start_date ? String(args.contract_start_date) : null,
        contract_end_date: args.contract_end_date ? String(args.contract_end_date) : null,
        next_due_date: args.next_due_date ? String(args.next_due_date) : null,
        support_guarantee_end: args.support_guarantee_end ? String(args.support_guarantee_end) : null,
        billing_email: args.billing_email ? String(args.billing_email) : null,
        address: args.address ? String(args.address) : null,
        timezone: args.timezone ? String(args.timezone) : null,
        priority: args.priority ? String(args.priority) : "medium",
      });

      const client = await crmClientsQueries.findById(db, id);
      return {
        success: true,
        client,
        message: `Client "${args.name}" created successfully with ID: ${id}`,
      };
    }

    case "update_client": {
      const clientId = String(args.client_id);
      const existing = await crmClientsQueries.findById(db, clientId);
      if (!existing) return { error: "Client not found" };

      const updates: Record<string, unknown> = {};
      const fields = [
        "name", "email", "phone", "company", "industry", "website",
        "business_description", "service_type", "monthly_retainer", "contract_value",
        "contract_start_date", "contract_end_date", "next_due_date",
        "support_guarantee_end", "billing_email", "address", "timezone",
        "priority", "status", "notes",
      ];
      for (const f of fields) {
        if (args[f] !== undefined) updates[f] = args[f];
      }

      if (Object.keys(updates).length === 0) {
        return { error: "No fields to update" };
      }

      await crmClientsQueries.update(db, clientId, updates);
      const updated = await crmClientsQueries.findById(db, clientId);
      return {
        success: true,
        client: updated,
        message: `Client updated successfully`,
      };
    }

    case "add_client_note": {
      const id = generateId();
      await clientNotesQueries.create(db, {
        id,
        client_id: String(args.client_id),
        type: args.type ? String(args.type) : "note",
        content: String(args.content),
        created_by: actingUserId,
      });
      return {
        success: true,
        note_id: id,
        message: `Note added to client`,
      };
    }

    case "list_client_notes": {
      if (args.client_id) {
        const result = await clientNotesQueries.findByClient(db, String(args.client_id));
        return { notes: result.results ?? [] };
      }
      const result = await clientNotesQueries.listAll(db);
      return { notes: result.results ?? [] };
    }

    case "schedule_appointment": {
      const id = generateId();
      await appointmentsQueries.create(db, {
        id,
        client_id: String(args.client_id),
        title: String(args.title),
        description: args.description ? String(args.description) : null,
        scheduled_at: String(args.scheduled_at),
        duration_minutes: args.duration_minutes ? Number(args.duration_minutes) : 30,
        status: "scheduled",
        notes: null,
        created_by: actingUserId,
        source: args.source ? String(args.source) : "manual",
      });
      return {
        success: true,
        appointment_id: id,
        message: `Appointment "${args.title}" scheduled`,
      };
    }

    case "list_appointments": {
      let appointments;
      if (args.client_id) {
        const result = await appointmentsQueries.findByClient(db, String(args.client_id));
        appointments = result.results ?? [];
      } else if (args.upcoming) {
        const result = await appointmentsQueries.listUpcoming(db);
        appointments = result.results ?? [];
      } else {
        const result = await appointmentsQueries.listAll(db);
        appointments = result.results ?? [];
      }

      if (args.status) {
        appointments = appointments.filter((a: any) => a.status === args.status);
      }

      return { appointments };
    }

    case "update_appointment": {
      const aptId = String(args.appointment_id);
      const existing = await appointmentsQueries.findById(db, aptId);
      if (!existing) return { error: "Appointment not found" };

      if (args.status) {
        await appointmentsQueries.updateStatus(db, aptId, String(args.status));
      }
      if (args.title || args.scheduled_at) {
        const updates: Record<string, unknown> = {};
        if (args.title) updates.title = args.title;
        if (args.scheduled_at) updates.scheduled_at = args.scheduled_at;
        await appointmentsQueries.update(db, aptId, updates);
      }

      return { success: true, message: "Appointment updated" };
    }

    case "list_invoices": {
      let invoices;
      if (args.client_id) {
        const result = await invoiceQueries.findByClient(db, String(args.client_id));
        invoices = result.results ?? [];
      } else if (args.status) {
        const result = await db.prepare(
          `SELECT i.*, c.name as client_name FROM invoices i LEFT JOIN clients c ON i.client_id = c.id WHERE i.status = ? ORDER BY i.created_at DESC`
        ).bind(String(args.status)).all();
        invoices = result.results ?? [];
      } else {
        const result = await invoiceQueries.listAll(db);
        invoices = result.results ?? [];
      }
      return { invoices };
    }

    case "create_invoice": {
      const countResult = await invoiceQueries.getNextNumber(db);
      const count = (countResult?.count as number) ?? 0;
      const id = generateId();
      const invoiceNumber = generateInvoiceNumber(count);
      await invoiceQueries.create(db, {
        id,
        client_id: String(args.client_id),
        invoice_number: invoiceNumber,
        amount: Number(args.amount),
        currency: "USD",
        status: "draft",
        description: args.description ? String(args.description) : null,
        service_type: args.service_type ? String(args.service_type) : null,
        due_date: args.due_date ? String(args.due_date) : null,
        paid_date: null,
        created_by: actingUserId,
      });
      return {
        success: true,
        invoice_id: id,
        invoice_number: invoiceNumber,
        amount: args.amount,
        message: `Invoice ${invoiceNumber} created for $${args.amount}. Status: draft`,
      };
    }

    case "update_invoice_status": {
      const paidDate = args.status === "paid" ? new Date().toISOString().split("T")[0] : undefined;
      await invoiceQueries.updateStatus(db, String(args.invoice_id), String(args.status), paidDate);
      return {
        success: true,
        message: `Invoice status updated to "${args.status}"${paidDate ? ` (paid on ${paidDate})` : ""}`,
      };
    }

    case "list_staff": {
      const result = await userQueries.listAll(db);
      const staff = (result.results ?? []).filter(
        (u) => u.role === "admin" || u.role === "staff"
      );
      return { staff };
    }

    case "create_staff": {
      const id = generateId();
      const tempPassword = crypto.randomUUID().slice(0, 12);
      const passwordHash = await hashPassword(tempPassword);
      await userQueries.create(db, {
        id,
        email: String(args.email),
        password_hash: passwordHash,
        name: String(args.name),
        role: String(args.role),
        created_by: actingUserId,
      });
      return {
        success: true,
        staff_id: id,
        name: args.name,
        email: args.email,
        role: args.role,
        temp_password: tempPassword,
        message: `Staff member "${args.name}" created with role "${args.role}". Temporary password: ${tempPassword}`,
      };
    }

    case "deactivate_staff": {
      await userQueries.setActive(db, String(args.staff_id), false);
      return { success: true, message: "Staff member deactivated" };
    }

    case "list_documents": {
      if (args.category) {
        const result = await documentQueries.findByCategory(db, String(args.category));
        return { documents: result.results ?? [] };
      }
      const result = await documentQueries.listAll(db);
      return { documents: result.results ?? [] };
    }

    case "get_document": {
      const doc = await documentQueries.findById(db, String(args.document_id));
      if (!doc) return { error: "Document not found" };
      return { document: doc };
    }

    case "get_dashboard_stats": {
      const [clients, staff, revenue, outstanding, activeProjects] = await Promise.all([
        crmClientsQueries.countAll(db),
        userQueries.countByRole(db, "staff"),
        invoiceQueries.stats(db).thisMonth,
        invoiceQueries.stats(db).outstanding,
        projectQueries.countActive(db),
      ]);
      return {
        total_clients: clients?.count ?? 0,
        total_staff: staff?.count ?? 0,
        monthly_revenue: revenue?.total ?? 0,
        outstanding_amount: outstanding?.total ?? 0,
        outstanding_count: outstanding?.count ?? 0,
        active_projects: activeProjects?.count ?? 0,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

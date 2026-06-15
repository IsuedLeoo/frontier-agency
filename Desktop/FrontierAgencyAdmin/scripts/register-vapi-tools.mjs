/**
 * Register all voice agent tools with Vapi.
 *
 * Usage:
 *   npx tsx scripts/register-vapi-tools.mjs
 *
 * Requires env vars:
 *   VAPI_PRIVATE_KEY  - Your Vapi private API key
 *   VAPI_ASSISTANT_ID - The assistant ID to register tools on
 *   APP_URL           - The base URL of the deployed app (e.g. https://admin.frontieragency.com)
 */

const VAPI_BASE = "https://api.vapi.ai";

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

if (!VAPI_PRIVATE_KEY) {
  console.error("ERROR: VAPI_PRIVATE_KEY env var is required");
  process.exit(1);
}
if (!VAPI_ASSISTANT_ID) {
  console.error("ERROR: VAPI_ASSISTANT_ID env var is required");
  process.exit(1);
}

async function vapiRequest(method, path, body) {
  const res = await fetch(`${VAPI_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vapi ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

// ─── Tool Definitions ────────────────────────────────────────────────────────

const TOOLS = [
  // ── Client Tools ──────────────────────────────────────────────────────────

  {
    name: "find_client",
    description:
      "Look up a client by phone number or email. Use this first when a caller identifies themselves to retrieve their CRM record.",
    parameters: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description: "Client phone number (e.g. +19862010858). If not provided, uses the caller's number.",
        },
      },
      required: [],
    },
  },

  {
    name: "create_client",
    description:
      "Create a new client in the CRM. Use when a caller is a new lead and wants to get set up.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Full name of the client" },
        email: { type: "string", description: "Client email address" },
        phone: { type: "string", description: "Client phone number" },
        company: { type: "string", description: "Company or business name" },
        industry: { type: "string", description: "Industry or business type" },
        website: { type: "string", description: "Company website URL" },
        notes: { type: "string", description: "Any notes about the client" },
        business_description: {
          type: "string",
          description: "Brief description of the client's business",
        },
        service_type: {
          type: "string",
          description: "Service they're interested in (e.g. AI Receptionist, Email Automation)",
        },
      },
      required: ["name"],
    },
  },

  {
    name: "update_client",
    description:
      "Update an existing client's information in the CRM. Use when a caller wants to change their details. Only provided fields will be updated.",
    parameters: {
      type: "object",
      properties: {
        client_id: {
          type: "string",
          description: "The CRM client ID (from find_client)",
        },
        name: { type: "string", description: "Updated full name" },
        email: { type: "string", description: "Updated email address" },
        phone: { type: "string", description: "Updated phone number" },
        company: { type: "string", description: "Updated company name" },
        industry: { type: "string", description: "Updated industry" },
        status: {
          type: "string",
          enum: ["lead", "qualified", "customer", "inactive"],
          description: "Client status in the sales pipeline",
        },
        business_description: { type: "string", description: "Updated business description" },
        service_type: { type: "string", description: "Updated service type" },
        monthly_retainer: { type: "number", description: "Monthly retainer amount in USD" },
        contract_value: { type: "number", description: "Total contract value in USD" },
        contract_start_date: { type: "string", description: "Contract start date (ISO format)" },
        contract_end_date: { type: "string", description: "Contract end date (ISO format)" },
        next_due_date: { type: "string", description: "Next payment due date (ISO format)" },
        support_guarantee_end: { type: "string", description: "Support guarantee end date (ISO format)" },
        billing_email: { type: "string", description: "Billing email address" },
        address: { type: "string", description: "Physical address" },
        timezone: { type: "string", description: "Timezone (e.g. America/New_York)" },
        assigned_to: { type: "string", description: "Staff member ID to assign" },
        last_contact_at: { type: "string", description: "Last contact timestamp (ISO format)" },
        priority: {
          type: "string",
          enum: ["low", "medium", "high", "vip"],
          description: "Client priority level",
        },
        notes: { type: "string", description: "Updated notes" },
      },
      required: ["client_id"],
    },
  },

  {
    name: "add_client_note",
    description:
      "Add a note to a client's record. Use to log call summaries, follow-up items, or any interaction details.",
    parameters: {
      type: "object",
      properties: {
        client_id: {
          type: "string",
          description: "The CRM client ID",
        },
        content: {
          type: "string",
          description: "The note content to add",
        },
        type: {
          type: "string",
          enum: ["note", "call", "email", "meeting", "voice_call"],
          description: "Type of note. Default: voice_call",
        },
      },
      required: ["client_id", "content"],
    },
  },

  {
    name: "find_notes",
    description:
      "Retrieve all notes for a client. Use when you need to review the client's interaction history.",
    parameters: {
      type: "object",
      properties: {
        client_id: {
          type: "string",
          description: "The CRM client ID",
        },
      },
      required: ["client_id"],
    },
  },

  {
    name: "update_note",
    description:
      "Update the content of an existing note. Use when a note needs to be corrected or expanded.",
    parameters: {
      type: "object",
      properties: {
        note_id: {
          type: "string",
          description: "The note ID to update",
        },
        content: {
          type: "string",
          description: "The updated note content",
        },
      },
      required: ["note_id", "content"],
    },
  },

  {
    name: "delete_note",
    description:
      "Delete a note from a client's record. Use when a note is incorrect or no longer needed.",
    parameters: {
      type: "object",
      properties: {
        note_id: {
          type: "string",
          description: "The note ID to delete",
        },
      },
      required: ["note_id"],
    },
  },

  // ── Appointment Tools ─────────────────────────────────────────────────────

  {
    name: "schedule_appointment",
    description:
      "Schedule a new appointment for a client. Use when a caller wants to book a meeting or call.",
    parameters: {
      type: "object",
      properties: {
        client_id: {
          type: "string",
          description: "The CRM client ID",
        },
        title: {
          type: "string",
          description: "Appointment title (e.g. 'Consultation Call', 'Follow-up Meeting')",
        },
        scheduled_at: {
          type: "string",
          description: "Date and time in ISO 8601 format (e.g. 2026-06-15T14:00:00-04:00)",
        },
        duration_minutes: {
          type: "number",
          description: "Duration in minutes. Default: 30",
        },
        description: {
          type: "string",
          description: "Appointment description or agenda",
        },
        notes: {
          type: "string",
          description: "Additional notes about the appointment",
        },
      },
      required: ["client_id", "scheduled_at"],
    },
  },

  {
    name: "find_appointments",
    description:
      "Find all appointments for a client. Use when a caller asks about their upcoming or past appointments.",
    parameters: {
      type: "object",
      properties: {
        client_id: {
          type: "string",
          description: "The CRM client ID",
        },
      },
      required: ["client_id"],
    },
  },

  {
    name: "update_appointment",
    description:
      "Update an existing appointment. Use when a caller wants to reschedule, change details, or update status (e.g. mark as completed or no-show).",
    parameters: {
      type: "object",
      properties: {
        appointment_id: {
          type: "string",
          description: "The appointment ID to update",
        },
        title: { type: "string", description: "Updated title" },
        description: { type: "string", description: "Updated description" },
        scheduled_at: {
          type: "string",
          description: "Updated date/time in ISO 8601 format (for rescheduling)",
        },
        duration_minutes: { type: "number", description: "Updated duration in minutes" },
        status: {
          type: "string",
          enum: ["scheduled", "completed", "cancelled", "no_show"],
          description: "Updated status. Use 'completed' to mark done, 'no_show' if client didn't show",
        },
        notes: { type: "string", description: "Updated notes" },
      },
      required: ["appointment_id"],
    },
  },

  {
    name: "cancel_appointment",
    description:
      "Cancel an appointment. Use when a caller wants to cancel a scheduled appointment.",
    parameters: {
      type: "object",
      properties: {
        appointment_id: {
          type: "string",
          description: "The appointment ID to cancel",
        },
      },
      required: ["appointment_id"],
    },
  },

  // ── Service Docs Tools ────────────────────────────────────────────────────

  {
    name: "search_docs",
    description:
      "Search the service documentation. Use when a caller asks about services, pricing, or company info.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (e.g. 'pricing', 'AI receptionist', 'email automation')",
        },
      },
      required: ["query"],
    },
  },

  {
    name: "get_doc",
    description:
      "Get a specific document by its slug. Use when you need the full content of a known document.",
    parameters: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Document slug (e.g. 'ai-receptionist', 'pricing', 'about')",
        },
      },
      required: ["slug"],
    },
  },

  {
    name: "create_service_doc",
    description:
      "Create a new service documentation entry. Use when adding new service info, FAQs, or knowledge base articles.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Document title" },
        slug: {
          type: "string",
          description: "URL-friendly slug (e.g. 'new-service-name')",
        },
        category: {
          type: "string",
          description: "Category (e.g. 'services', 'company', 'faq')",
        },
        content: {
          type: "string",
          description: "Full document content (can be detailed)",
        },
        tags: {
          type: "string",
          description: "JSON array of tags as a string (e.g. '[\"tag1\",\"tag2\"]')",
        },
      },
      required: ["title", "slug", "category", "content"],
    },
  },

  {
    name: "update_service_doc",
    description:
      "Update an existing service document. Use when service info, pricing, or documentation needs to be changed.",
    parameters: {
      type: "object",
      properties: {
        doc_id: {
          type: "string",
          description: "Document ID (if known)",
        },
        slug: {
          type: "string",
          description: "Document slug (used if doc_id is not provided)",
        },
        title: { type: "string", description: "Updated title" },
        content: { type: "string", "description": "Updated content" },
        category: { type: "string", description: "Updated category" },
        tags: {
          type: "string",
          description: "Updated JSON array of tags as a string",
        },
      },
      required: [],
    },
  },

  // ── Call Management ───────────────────────────────────────────────────────

  {
    name: "transfer_call",
    description:
      "Transfer the call to a human. Use when the caller specifically requests to speak to a person, or the request is too complex for the AI.",
    parameters: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description: "Phone number to transfer to. Default: +1 (986) 201-0858",
        },
      },
      required: [],
    },
  },
];

// ─── Registration ────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔧 Registering ${TOOLS.length} tools with Vapi...\n`);
  console.log(`   Assistant: ${VAPI_ASSISTANT_ID}`);
  console.log(`   Tool URL:  ${APP_URL}/api/voice/tools\n`);

  // First, get the current assistant to see existing tools
  console.log("📋 Fetching current assistant config...");
  const assistant = await vapiRequest("GET", `/assistant/${VAPI_ASSISTANT_ID}`);
  console.log(`   Assistant name: ${assistant.name ?? "unknown"}`);
  const existingTools = (assistant.model?.tools ?? []).length;
  console.log(`   Existing tools: ${existingTools}\n`);

  // Create all tools in Vapi
  const createdToolIds = [];
  for (const tool of TOOLS) {
    try {
      const created = await vapiRequest("POST", "/tool", {
        type: "function",
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
        server: {
          url: `${APP_URL}/api/voice/tools`,
          timeoutSeconds: 10,
        },
      });
      createdToolIds.push(created.id);
      console.log(`   ✅ ${tool.name} → ${created.id}`);
    } catch (err) {
      console.error(`   ❌ ${tool.name}: ${err.message}`);
    }
  }

  console.log(`\n📎 Attaching ${createdToolIds.length} tools to assistant...`);

  // Build inline tool definitions (Vapi requires inline format for PATCH, not ID references)
  const inlineTools = TOOLS.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));

  // Keep any non-function tools (e.g. providers, transports) from existing config
  const nonFunctionTools = (assistant.model?.tools ?? [])
    .filter((t) => t.type !== "function");

  // Update assistant with inline tool definitions
  await vapiRequest("PATCH", `/assistant/${VAPI_ASSISTANT_ID}`, {
    model: {
      ...assistant.model,
      tools: [...nonFunctionTools, ...inlineTools],
    },
  });

  console.log(`\n✅ Done! ${createdToolIds.length} new tools registered.`);
  console.log(`   Total tools on assistant: ${inlineTools.length + nonFunctionTools.length}`);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});

import { getSession } from "@/lib/auth";
import { getDb, voiceCallScheduleQueries, voiceCallsQueries, generateId } from "@/lib/db";
import { initiateOutboundCall } from "@/lib/voice/vapi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    phone_number?: string;
    scheduled_at?: string;
    voice_overrides?: {
      system_prompt?: string;
      welcome_message?: string;
      voice_provider?: string;
      voice_id?: string;
      model?: string;
    };
  };
  const phoneNumber = body?.phone_number?.trim();
  const scheduledAt = body?.scheduled_at?.trim();
  const voiceOverrides = body?.voice_overrides;

  if (!phoneNumber) {
    return Response.json({ error: "Phone number required" }, { status: 400 });
  }

  const e164Regex = /^\+[1-9]\d{1,14}$/;
  if (!e164Regex.test(phoneNumber)) {
    return Response.json(
      { error: "Invalid phone number. Use E.164 format (e.g. +1234567890)" },
      { status: 400 }
    );
  }

  // If scheduled for the future, store in schedule table
  if (scheduledAt) {
    const scheduleDate = new Date(scheduledAt);
    if (isNaN(scheduleDate.getTime()) || scheduleDate <= new Date()) {
      return Response.json(
        { error: "scheduled_at must be a valid future date/time" },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = generateId();

    // Create the Vapi call record for tracking
    await voiceCallsQueries.create(db, {
      id: generateId(),
      call_control_id: null,
      direction: "outbound",
      from_number: null,
      to_number: phoneNumber,
      status: "scheduled",
      initiated_by: user.id,
    });

    await voiceCallScheduleQueries.create(db, {
      id,
      phone_number: phoneNumber,
      scheduled_at: scheduledAt,
      initiated_by: user.id,
    });

    return Response.json({
      success: true,
      scheduled: true,
      schedule_id: id,
      to: phoneNumber,
      scheduled_at: scheduledAt,
      message: `Call to ${phoneNumber} scheduled for ${scheduleDate.toLocaleString()}`,
    });
  }

  // Immediate outbound call
  try {
    const { callId } = await initiateOutboundCall({
      to: phoneNumber,
      metadata: { initiated_by: user.id },
      ...(voiceOverrides ? { voiceOverrides } : {}),
    });

    // Track in DB
    const db = getDb();
    await voiceCallsQueries.create(db, {
      id: generateId(),
      call_control_id: callId,
      direction: "outbound",
      from_number: null,
      to_number: phoneNumber,
      status: "initiated",
      initiated_by: user.id,
    });

    return Response.json({
      success: true,
      call_id: callId,
      to: phoneNumber,
      message: `Calling ${phoneNumber}...`,
    });
  } catch (err) {
    // Outbound call error
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to initiate call" },
      { status: 500 }
    );
  }
}

/**
 * Cloudflare Worker scheduled event handler.
 * This is called by the cron trigger defined in wrangler.jsonc.
 *
 * It fetches the dialer execute endpoint internally to trigger
 * pending outbound calls.
 */

export async function handleScheduledEvent(
  env: Record<string, unknown>,
  ctx: ExecutionContext
): Promise<void> {
  // Get the worker URL from env or construct it
  const baseUrl = env.WORKER_BASE_URL as string | undefined;

  if (!baseUrl) {
    console.log("[Scheduled] No WORKER_BASE_URL set, skipping dialer execution");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/api/voice/dialer/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.CRON_SECRET || ""}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("[Scheduled] Dialer execution result:", JSON.stringify(result));
    } else {
      console.error("[Scheduled] Dialer execution failed:", response.status);
    }
  } catch (err) {
    console.error("[Scheduled] Dialer execution error:", err);
  }
}

/**
 * Cloudflare Worker scheduled event handler for the auto-dialer.
 * Configured via wrangler.jsonc cron triggers (every 15 min, Mon-Fri 9AM-5PM ET).
 *
 * Calls the dialer execute endpoint internally to trigger pending outbound calls.
 */

export async function handleScheduledEvent(
  env: Record<string, unknown>,
  ctx: ExecutionContext
): Promise<void> {
  const baseUrl = env.WORKER_BASE_URL as string | undefined;
  const cronSecret = env.CRON_SECRET as string | undefined;

  const url = baseUrl
    ? `${baseUrl}/api/voice/dialer/execute`
    : "https://admin.frontieragency.gstudios.dev/api/voice/dialer/execute";

  console.log(`[Cron] Triggering dialer at ${url}`);

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (cronSecret) {
    headers["Authorization"] = `Bearer ${cronSecret}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
    });

    if (response.ok) {
      const result = (await response.json()) as { executed?: number; message?: string };
      console.log(`[Cron] Dialer executed: ${result.executed ?? 0} calls`);
    } else {
      console.error(`[Cron] Dialer failed: ${response.status} ${response.statusText}`);
      // Retry once on failure
      ctx.waitUntil(
        new Promise((resolve) =>
          setTimeout(async () => {
            const retryResponse = await fetch(url, { method: "POST", headers });
            console.log(`[Cron] Retry status: ${retryResponse.status}`);
            resolve(undefined);
          }, 30_000)
        )
      );
    }
  } catch (err) {
    console.error(`[Cron] Dialer execution error:`, err);
  }
}

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

  if (!baseUrl) {
    // WORKER_BASE_URL env var must be configured
    return;
  }
  const url = `${baseUrl}/api/voice/dialer/execute`;

  // Triggering dialer

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
      // Dialer executed
    } else {
      // Dialer failed, retrying
      // Retry once on failure
      ctx.waitUntil(
        new Promise((resolve) =>
          setTimeout(async () => {
            const retryResponse = await fetch(url, { method: "POST", headers });
            // Retry attempted
            resolve(undefined);
          }, 30_000)
        )
      );
    }
  } catch (err) {
    // Cron dialer execution error
  }
}

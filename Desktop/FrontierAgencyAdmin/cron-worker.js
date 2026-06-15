/**
 * Standalone Cloudflare Worker for cron-triggered dialer execution.
 *
 * Deploy with: npx wrangler deploy cron-worker.js --name frontier-dialer-cron
 *
 * Configure in Cloudflare Dashboard:
 *   Cron Trigger: */5 14-22 * * 1-5  (Every 5 min, Mon-Fri, 9AM-5PM ET)
 *
 * Required env vars:
 *   ADMIN_BASE_URL = https://admin.frontieragency.gstudios.dev
 */

export default {
  async scheduled(controller, env, ctx) {
    const baseUrl = env.ADMIN_BASE_URL;
    if (!baseUrl) {
      console.error("[Cron] ADMIN_BASE_URL not set");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/voice/dialer/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.error("[Cron] Execute failed:", response.status, await response.text().catch(() => ""));
      }
    } catch (err) {
      console.error("[Cron] Fetch error:", err);
    }
  },
};

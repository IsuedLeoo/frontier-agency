/**
 * Analyze completed calls and extract learning insights.
 *
 * This endpoint processes recent completed calls that haven't been analyzed yet,
 * extracts patterns, and stores learnings in the database.
 */

import { getDb, voiceCallsQueries, generateId } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { analyzeCall, extractLearnings } from "@/lib/voice/agent-learning";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { env } = getCloudflareContext();
  const db = env.frontier_agency_db as D1Database;

  try {
    // Get recent completed calls that haven't been analyzed
    const recentCalls = await voiceCallsQueries.listAll(db, 20);

    const unanalyzed = (recentCalls.results ?? []).filter(
      (c) => c.status === "completed" && c.transcript
    );

    if (unanalyzed.length === 0) {
      return Response.json({ analyzed: 0, message: "No unanalyzed calls" });
    }

    const analyses = [];
    const allLearnings = [];

    for (const call of unanalyzed) {
      const analysis = analyzeCall(
        call.transcript || "",
        call.summary || ""
      );
      analysis.callId = call.id;
      analysis.duration = call.duration_seconds || 0;
      analyses.push(analysis);

      // Store analysis in DB
      await db
        .prepare(
          `INSERT OR REPLACE INTO call_analyses
           (id, call_id, outcome, booking_secured, turn_count, sentiment,
            objections, successful_patterns, improvement_areas, summary)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          generateId(),
          call.id,
          analysis.outcome,
          analysis.bookingSecured ? 1 : 0,
          analysis.turnCount,
          analysis.sentiment,
          JSON.stringify(analysis.objections),
          JSON.stringify(analysis.successfulPatterns),
          JSON.stringify(analysis.improvementAreas),
          analysis.summary
        )
        .run();
    }

    // Extract learnings from all analyses
    const learnings = extractLearnings(analyses);

    for (const learning of learnings) {
      await db
        .prepare(
          `INSERT OR IGNORE INTO agent_learnings
           (id, type, content, source_calls, confidence, applied, created_at)
           VALUES (?, ?, ?, ?, ?, 0, datetime('now'))`
        )
        .bind(
          learning.id,
          learning.type,
          learning.content,
          JSON.stringify(learning.sourceCalls),
          learning.confidence
        )
        .run();

      allLearnings.push(learning);
    }

    return Response.json({
      analyzed: analyses.length,
      learnings: allLearnings.length,
      outcomes: analyses.map((a) => ({
        callId: a.callId,
        outcome: a.outcome,
        sentiment: a.sentiment,
      })),
    });
  } catch (err) {
    console.error("[Analyze] Error:", err);
    return Response.json(
      { error: "Failed to analyze calls" },
      { status: 500 }
    );
  }
}

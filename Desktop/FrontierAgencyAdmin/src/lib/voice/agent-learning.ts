/**
 * Agent Learning System
 *
 * Analyzes call transcripts to extract successful patterns,
 * tracks performance metrics, and improves the agent's system prompt over time.
 *
 * Key metrics:
 * - Booking rate: % of calls that result in an appointment
 * - Conversation quality: avg turns, engagement signals
 * - Objection handling: which responses work best
 * - Learning extraction: what phrases/patterns lead to bookings
 */

import type { VoiceCall } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CallAnalysis {
  callId: string;
  duration: number;
  turnCount: number;
  outcome: "booked" | "interested" | "not_interested" | "no_answer" | "failed";
  bookingSecured: boolean;
  keyPhrases: string[];
  objections: string[];
  successfulPatterns: string[];
  improvementAreas: string[];
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
}

export interface AgentStats {
  totalCalls: number;
  completedCalls: number;
  bookings: number;
  bookingRate: number;
  avgDuration: number;
  avgTurns: number;
  topObjections: string[];
  topPhrases: string[];
  trendDirection: "improving" | "stable" | "declining";
  recentBookingRate: number; // last 10 calls
  overallBookingRate: number;
}

export interface LearningInsight {
  id: string;
  type: "successful_pattern" | "objection_handler" | "phrase_improvement" | "timing";
  content: string;
  sourceCalls: string[];
  confidence: number; // 0-1
  applied: boolean;
  createdAt: string;
}

// ─── Call Analysis ───────────────────────────────────────────────────────────

/**
 * Analyze a completed call transcript to extract insights.
 */
export function analyzeCall(transcript: string, summary: string): CallAnalysis {
  const lines = transcript.split("\n").filter((l) => l.trim());
  const turnCount = lines.length;

  // Determine outcome from transcript/summary
  const lowerTranscript = transcript.toLowerCase();
  const lowerSummary = summary.toLowerCase();

  let outcome: CallAnalysis["outcome"] = "not_interested";
  let bookingSecured = false;

  if (
    lowerTranscript.includes("schedule_appointment") ||
    lowerTranscript.includes("booked") ||
    lowerSummary.includes("booked") ||
    lowerSummary.includes("appointment scheduled") ||
    lowerSummary.includes("meeting confirmed")
  ) {
    outcome = "booked";
    bookingSecured = true;
  } else if (
    lowerSummary.includes("interested") ||
    lowerSummary.includes("call back") ||
    lowerSummary.includes("follow up")
  ) {
    outcome = "interested";
  } else if (
    lowerSummary.includes("no answer") ||
    lowerSummary.includes("voicemail") ||
    turnCount < 3
  ) {
    outcome = "no_answer";
  } else if (
    lowerSummary.includes("failed") ||
    lowerSummary.includes("error")
  ) {
    outcome = "failed";
  }

  // Extract objections
  const objectionPatterns = [
    /not interested/i,
    /no thanks?/i,
    /we('re| are) good/i,
    /already have/i,
    /too expensive/i,
    /no budget/i,
    /send (me )?info/i,
    /call back later/i,
    /i('m| am) busy/i,
    /not now/i,
    /don't need/i,
  ];
  const objections: string[] = [];
  for (const pattern of objectionPatterns) {
    const match = lowerTranscript.match(pattern);
    if (match) objections.push(match[0]);
  }

  // Extract successful phrases (things the agent said right before positive responses)
  const successfulPatterns: string[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].toLowerCase();
    const nextLine = lines[i + 1]?.toLowerCase() || "";
    if (
      (nextLine.includes("yes") || nextLine.includes("sure") || nextLine.includes("okay")) &&
      line.includes("agent:")
    ) {
      successfulPatterns.push(lines[i].replace(/^agent:\s*/i, ""));
    }
  }

  // Sentiment analysis (simple keyword-based)
  const positiveWords = ["great", "awesome", "perfect", "sounds good", "love", "interested", "yes", "sure", "absolutely"];
  const negativeWords = ["no", "not interested", "busy", "expensive", "don't", "won't", "can't"];
  let positiveScore = 0;
  let negativeScore = 0;
  for (const word of positiveWords) {
    if (lowerTranscript.includes(word)) positiveScore++;
  }
  for (const word of negativeWords) {
    if (lowerTranscript.includes(word)) negativeScore++;
  }
  const sentiment: CallAnalysis["sentiment"] =
    positiveScore > negativeScore + 2 ? "positive" :
    negativeScore > positiveScore + 2 ? "negative" : "neutral";

  // Improvement areas
  const improvementAreas: string[] = [];
  if (turnCount < 5) improvementAreas.push("Call ended too quickly — try building more rapport");
  if (objections.length > 2) improvementAreas.push("Multiple objections — improve objection handling");
  if (sentiment === "negative") improvementAreas.push("Negative sentiment — adjust tone to be warmer");
  if (!bookingSecured && outcome !== "no_answer") improvementAreas.push("Didn't secure booking — try asking for commitment earlier");

  return {
    callId: "",
    duration: 0,
    turnCount,
    outcome,
    bookingSecured,
    keyPhrases: extractKeyPhrases(transcript),
    objections: [...new Set(objections)],
    successfulPatterns,
    improvementAreas,
    sentiment,
    summary: summary || generateSummary(transcript),
  };
}

function extractKeyPhrases(transcript: string): string[] {
  const phrases: string[] = [];
  const lines = transcript.split("\n");
  for (const line of lines) {
    if (line.toLowerCase().includes("agent:")) {
      const text = line.replace(/^agent:\s*/i, "").trim();
      if (text.length > 10 && text.length < 100) {
        phrases.push(text);
      }
    }
  }
  return phrases.slice(0, 10);
}

function generateSummary(transcript: string): string {
  const lines = transcript.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return "No transcript available";
  if (lines.length < 3) return "Call was very short — likely no answer or immediate hang up";
  return `Call had ${lines.length} turns. ${lines.slice(0, 3).join(" ")}`;
}

// ─── Agent Stats ─────────────────────────────────────────────────────────────

/**
 * Get aggregate agent performance stats from the database.
 */
export async function getAgentStats(db: D1Database): Promise<AgentStats> {
  // Total calls
  const totalResult = await db
    .prepare("SELECT COUNT(*) as count FROM voice_calls")
    .first<{ count: number }>();

  // Completed calls (not failed/no_answer)
  const completedResult = await db
    .prepare("SELECT COUNT(*) as count FROM voice_calls WHERE status = 'completed'")
    .first<{ count: number }>();

  // Bookings (calls with appointment data in summary)
  const bookingsResult = await db
    .prepare("SELECT COUNT(*) as count FROM voice_calls WHERE summary LIKE '%booked%' OR summary LIKE '%appointment%' OR summary LIKE '%scheduled%'")
    .first<{ count: number }>();

  // Avg duration
  const avgDurationResult = await db
    .prepare("SELECT COALESCE(AVG(duration_seconds), 0) as avg FROM voice_calls WHERE duration_seconds IS NOT NULL AND duration_seconds > 0")
    .first<{ avg: number }>();

  // Recent 10 calls booking rate
  const recentCalls = await db
    .prepare("SELECT summary FROM voice_calls ORDER BY created_at DESC LIMIT 10")
    .all<{ summary: string }>();

  const recentBookings = recentCalls.results?.filter(
    (c) => c.summary?.includes("booked") || c.summary?.includes("appointment")
  ).length ?? 0;

  const total = totalResult?.count ?? 0;
  const completed = completedResult?.count ?? 0;
  const bookings = bookingsResult?.count ?? 0;

  return {
    totalCalls: total,
    completedCalls: completed,
    bookings,
    bookingRate: completed > 0 ? (bookings / completed) * 100 : 0,
    avgDuration: Math.round(avgDurationResult?.avg ?? 0),
    avgTurns: 0, // Would need transcript parsing
    topObjections: [],
    topPhrases: [],
    trendDirection: recentBookings >= 3 ? "improving" : recentBookings >= 1 ? "stable" : "declining",
    recentBookingRate: recentCalls.results?.length ? (recentBookings / recentCalls.results.length) * 100 : 0,
    overallBookingRate: completed > 0 ? (bookings / completed) * 100 : 0,
  };
}

// ─── Learning Insights ───────────────────────────────────────────────────────

/**
 * Extract learning insights from a batch of analyzed calls.
 * Returns insights that can be used to improve the agent's prompt.
 */
export function extractLearnings(analyses: CallAnalysis[]): LearningInsight[] {
  const insights: LearningInsight[] = [];

  // Find common successful patterns
  const patternCounts = new Map<string, number>();
  for (const analysis of analyses) {
    if (analysis.bookingSecured) {
      for (const pattern of analysis.successfulPatterns) {
        const normalized = pattern.toLowerCase().trim();
        patternCounts.set(normalized, (patternCounts.get(normalized) ?? 0) + 1);
      }
    }
  }

  for (const [pattern, count] of patternCounts) {
    if (count >= 2) {
      insights.push({
        id: crypto.randomUUID(),
        type: "successful_pattern",
        content: `Successful phrase: "${pattern}"`,
        sourceCalls: [],
        confidence: Math.min(count / 5, 1),
        applied: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Find common objections and how they were handled
  const objectionCounts = new Map<string, number>();
  for (const analysis of analyses) {
    for (const objection of analysis.objections) {
      objectionCounts.set(objection, (objectionCounts.get(objection) ?? 0) + 1);
    }
  }

  for (const [objection, count] of objectionCounts) {
    if (count >= 2) {
      insights.push({
        id: crypto.randomUUID(),
        type: "objection_handler",
        content: `Common objection: "${objection}" — appeared ${count} times`,
        sourceCalls: [],
        confidence: Math.min(count / 5, 1),
        applied: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return insights;
}

/**
 * Generate an improved system prompt based on learnings.
 */
export function generateImprovedPrompt(
  basePrompt: string,
  learnings: LearningInsight[]
): string {
  const successfulPatterns = learnings.filter((l) => l.type === "successful_pattern" && l.confidence > 0.3);
  const objectionHandlers = learnings.filter((l) => l.type === "objection_handler" && l.confidence > 0.3);

  if (successfulPatterns.length === 0 && objectionHandlers.length === 0) {
    return basePrompt;
  }

  let addition = "\n\n## What's Working\n";

  if (successfulPatterns.length > 0) {
    addition += "These phrases have been effective:\n";
    for (const p of successfulPatterns.slice(0, 5)) {
      addition += `- ${p.content}\n`;
    }
  }

  if (objectionHandlers.length > 0) {
    addition += "\nCommon objections to handle:\n";
    for (const o of objectionHandlers.slice(0, 5)) {
      addition += `- ${o.content}\n`;
    }
  }

  return basePrompt + addition;
}

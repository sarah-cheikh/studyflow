import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import { generateStudyPlan, type StudyData } from "./studyPlanner";

const app = express();
const PORT = 5000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StudyFlow backend is running",
  });
});

interface StudyDay {
  day: number;
  tasks: string[];
}

interface StudyPlanResult {
  summary: string;
  days: StudyDay[];
}

// Basic shape check so a malformed AI response never reaches the frontend.
function isValidStudyPlan(value: unknown): value is StudyPlanResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  if (typeof v.summary !== "string") return false;
  if (!Array.isArray(v.days)) return false;

  return v.days.every(
    (day) =>
      typeof day === "object" &&
      day !== null &&
      typeof (day as StudyDay).day === "number" &&
      Array.isArray((day as StudyDay).tasks) &&
      (day as StudyDay).tasks.every((t) => typeof t === "string"),
  );
}

// Retries a call up to 2 extra times on a transient 503 (model overloaded),
// with a short delay between attempts. Any other error is thrown immediately.
async function callWithRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const is503 =
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status?: number }).status === 503;

      if (!is503 || attempt >= retries) {
        throw error;
      }

      const delayMs = 1000 * (attempt + 1);
      console.warn(`Gemini overloaded (503), retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function generatePlanWithAI(
  studyData: StudyData,
): Promise<StudyPlanResult> {
  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are a study planning assistant. Given a student's study information, produce a realistic day-by-day study plan.

Today's date: ${today}

Study data:
${JSON.stringify(studyData, null, 2)}

You MUST actually use every field below — do not just list chapters one-per-day and ignore the rest:

1. DEADLINE: Calculate the number of days between today and the deadline. Use that many days (or fewer only if the material genuinely finishes early with room to spare). Do not compress a plan into 2-3 days when the deadline is weeks away — spread work out, and add light review days if there's slack.

2. HOURS PER DAY: Use "hoursPerDay" to size each day's workload. A chapter that's too big to realistically finish in the given hours MUST be split across multiple days — e.g. "Chapter 5 (Part 1 of 2)" on day N and "Chapter 5 (Part 2 of 2)" on day N+1. Do not assume every chapter fits in one day. When splitting, use GENERIC labels only ("Part 1 of 2", "first half", "second half") — do NOT invent specific subtopic names, section titles, or content descriptions for what's inside a chapter. You do not know the actual contents of "${studyData.subject}" chapters beyond their names — only use exactly the chapter/material names the student provided, verbatim. Never state what a chapter is "about" unless the student's own text already says so.

3. DIFFICULT TOPICS: For every topic listed in "difficultTopics", you MUST:
   - Give it more total time than an average chapter (e.g. split across 2+ days, or pair it with a dedicated review/practice session a few days later).
   - Reference it BY NAME exactly as the student wrote it, labeled as a difficult topic (e.g. "Chapter 5 (difficult topic) - first pass" and later "Review Chapter 5 (difficult topic) - practice problems"). Do not add invented details about what makes it difficult or what it covers.
   - Explicitly name it in the summary and say why it's getting extra sessions.

4. COMPLETED CHAPTERS: Skip anything in "completedChapters" entirely — do not schedule it again.

5. SUMMARY: Write 2-4 sentences (not one generic line) that state: (a) how many days are available vs. how many you used, (b) which specific topics got extra attention and why, (c) roughly how the workload is paced across hoursPerDay.

6. NEVER invent chapter content, subtopics, or section titles that the student didn't provide. If you don't know what's actually inside a chapter, don't guess or describe it — just reference the chapter by its given name and use generic task verbs like "Study", "Review", "Practice exercises for".

Respond with ONLY valid JSON, no markdown code fences, no commentary, matching exactly this shape:
{
  "summary": "2-4 sentences covering pacing, day count, and which difficult topics got extra time and why",
  "days": [
    { "day": 1, "tasks": ["task 1", "task 2"] }
  ]
}`;

  const response = await callWithRetry(() =>
    ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 4096,
      },
    }),
  );

  const text = response.text;
  if (!text) {
    throw new Error("AI response contained no text content.");
  }

  // Strip ```json fences in case the model adds them despite instructions.
  const cleaned = text.replace(/```json|```/g, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Log the raw text so a truncated/malformed response is visible
    // in the server logs even though the user just sees the fallback plan.
    console.error("Raw AI text that failed to parse:", text);
    throw new Error("AI response was not valid JSON.");
  }

  if (!isValidStudyPlan(parsed)) {
    throw new Error("AI response did not match the expected study plan shape.");
  }

  return parsed;
}

app.post("/api/study-plan", async (req, res) => {
  const studyData = req.body as StudyData;

  console.log("Received study data:", studyData);

  try {
    const plan = await generatePlanWithAI(studyData);
    res.json(plan);
  } catch (error) {
    console.error(
      "AI plan generation failed, falling back to local logic:",
      error,
    );

    try {
      const fallbackPlan = generateStudyPlan(studyData);
      res.json(fallbackPlan);
    } catch (fallbackError) {
      console.error("Fallback plan generation also failed:", fallbackError);
      res.status(500).json({
        error: "Failed to generate a study plan. Please try again.",
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import { Router } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/matchStatus.js";
import { desc } from "drizzle-orm";

const matchRouter = Router();

const MAX_LIMIT = 100;

matchRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid query",
      details: JSON.stringify(parsed.error),
    });
  }

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);

    res.json({ data });
  } catch (err) {
    res.status(500).json({
      error: "Failed to lis matches.",
    });
  }

  res.status(200).json({
    message: "Matches list",
  });
});

matchRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid payload",
      details: JSON.stringify(parsed.error),
    });
  }

  try {
    const {
      data: { startTime, endTime, homeScore, awayScore },
    } = parsed;
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    res.status(201).json({ data: event });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create match",
      details: JSON.stringify(err),
    });
  }
});

export default matchRouter;

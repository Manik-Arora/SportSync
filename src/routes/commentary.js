import { Router } from "express";
import { matchIdParamSchema } from "../validation/matches.js";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validation/commentary.js";
import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

const MAX_LIMIT = 100;

const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", async (req, res) => {
  const parsedMatch = matchIdParamSchema.safeParse(req.params);

  if (!parsedMatch.success) {
    return res
      .status(400)
      .json({ error: "Invalid match ID.", details: parsedMatch.error.issues });
  }

  const parsedCommentary = listCommentaryQuerySchema.safeParse(req.query);
  if (!parsedCommentary.success) {
    return res.status(400).json({
      error: "Invalid query parameters.",
      details: parsedCommentary.error.issues,
    });
  }

  try {
    const { id: matchId } = parsedMatch.data;
    const { limit = 10 } = parsedCommentary.data;

    const safeLimit = Math.min(limit, MAX_LIMIT);

    const results = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(desc(commentary.createdAt))
      .limit(safeLimit);

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Failed to fetch commentary:", error);
    res.status(500).json({ error: "Failed to fetch commentary." });
  }
});

commentaryRouter.post("/", async (req, res) => {
  const parsedMatch = matchIdParamSchema.safeParse(req.params);
  if (!parsedMatch.success) {
    return res.status(400).json({
      error: "Invalid match ID.",
      details: parsedMatch.error.issues,
    });
  }

  const parsedCommentary = createCommentarySchema.safeParse(req.body);
  if (!parsedCommentary.success) {
    return res.status(400).json({
      message: "Invalid commentary payload.",
      details: parsedCommentary.error.issues,
    });
  }

  try {
    const { minutes, ...rest } = parsedCommentary.data;
    const [result] = await db
      .insert(commentary)
      .values({
        matchId: parsedMatch.data.id,
        minutes,
        ...rest,
      })
      .returning();

    res.status(201).json({ data: result });
  } catch (err) {
    console.error("Failed to create commentary");
    res.status(500).json({
      error: "Failed to create commentary.",
    });
  }
});

export default commentaryRouter;

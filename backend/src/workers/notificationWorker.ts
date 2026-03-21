import { Worker } from "bullmq";
import { db } from "../db/db.js";
import { notifications } from "../db/schema.js";
import { redisConfig } from "../lib/redis.js";

const worker = new Worker(
  "notifications",
  async (job) => {
    const { type, userId, fromUserId, cardId, commentId } = job.data;

    if (userId === fromUserId) return;

    await db.insert(notifications).values({
      user_id: userId,
      from_user_id: fromUserId,
      type,
      card_id: cardId,
      comment_id: commentId,
    });
  },
  {
    connection: redisConfig,
  },
);

worker.on("completed", (job) => {
  console.log(`Job concluded: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed: ${job?.id}`, err);
});

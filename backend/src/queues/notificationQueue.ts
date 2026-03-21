import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis.js";

export const notificationQueue = new Queue("notifications", {
  connection: redisConnection,
});

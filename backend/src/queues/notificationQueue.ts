import { Queue } from "bullmq";
import { redisConfig } from "../lib/redis.js";

export const notificationQueue = new Queue("notifications", {
  connection: redisConfig,
});

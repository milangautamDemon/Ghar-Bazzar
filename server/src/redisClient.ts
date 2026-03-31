/* eslint-disable no-console */
import { createClient } from "redis";

const redisEnabled = process.env.REDIS_ENABLED === "true";
const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT || 6379);

const redisClient = createClient({
  url: redisUrl || undefined,
  socket: {
    host: redisUrl ? undefined : redisHost,
    port: redisUrl ? undefined : redisPort,
    connectTimeout: 5000,
    reconnectStrategy: false,
  },
});

let redisReady = false;
let redisInitializationPromise: Promise<void> | null = null;

redisClient.on("ready", () => {
  redisReady = true;
  console.log("Redis Connected Successfully");
});

redisClient.on("end", () => {
  redisReady = false;
});

redisClient.on("error", (err) => {
  redisReady = false;
  console.error("Redis Client Error", err);
});

export const initializeRedis = async () => {
  if (!redisEnabled) {
    console.warn(
      "Redis is disabled. Set REDIS_ENABLED=true to enable token blacklist checks.",
    );
    return;
  }

  if (redisReady) {
    return;
  }

  if (redisInitializationPromise) {
    return redisInitializationPromise;
  }

  redisInitializationPromise = redisClient
    .connect()
    .then(() => undefined)
    .catch((error) => {
      console.warn(
        "Redis is unavailable. Continuing without token blacklist checks.",
      );
      console.error(error);
    })
    .finally(() => {
      redisInitializationPromise = null;
    });

  return redisInitializationPromise;
};

export const isRedisReady = () => redisEnabled && redisReady;

export default redisClient;

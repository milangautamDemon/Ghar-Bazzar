import { RequestHandler } from "express";

export const authDebugLogger: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;
  const hasAuthHeader = Boolean(authorization);
  const hasBearerPrefix = typeof authorization === "string" && authorization.startsWith("Bearer ");

  console.log(
    `[AUTH DEBUG] ${req.method} ${req.originalUrl} authHeader=${hasAuthHeader ? "present" : "missing"} bearer=${hasBearerPrefix ? "yes" : "no"}`,
  );

  next();
};

export default authDebugLogger;

import Jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { responseToClient } from "@utils/response";
import redisClient, { isRedisReady } from "@src/redisClient";
import { decryptPayload } from "@utils/decryptPayload";
import userService from "@services/user/userService";
import { TokenPayload } from "@utils/generateToken";

const deny = (req: Request, res: Response, message: string) => {
  console.warn(`[AUTH] 401 ${req.method} ${req.originalUrl} - ${message}`);
  return responseToClient(res, false, 401, message);
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return deny(req, res, "Authorization header is missing!");
  }

  if (!authHeader.startsWith("Bearer ")) {
    return deny(req, res, "Authorization format must be: Bearer <token>");
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return deny(req, res, "Access token is missing!");
  }

  try {
    if (isRedisReady()) {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return deny(req, res, "Token is blacklisted. Please login again!");
      }
    }

    const tokenVerify = Jwt.verify(
      token,
      process.env.JWT_KEY_ACCESS_TOKEN as string,
    ) as Jwt.JwtPayload;

    const encryptedData = tokenVerify?.data;
    if (!encryptedData) {
      return deny(req, res, "Token payload is invalid!");
    }

    const decrypted = decryptPayload(encryptedData);
    const payload: TokenPayload = JSON.parse(decrypted);
    const id = payload?.user?.id;

    if (!id) {
      return deny(req, res, "Token user payload is missing!");
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return deny(req, res, "User for this token does not exist!");
    }

    (req as any).user = {
      id,
      userId: id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof Jwt.TokenExpiredError) {
      return deny(req, res, "Token expired. Please login again!");
    }

    if (error instanceof Jwt.JsonWebTokenError) {
      return deny(req, res, "Invalid token!");
    }

    return deny(req, res, "Invalid or expired token!");
  }
};

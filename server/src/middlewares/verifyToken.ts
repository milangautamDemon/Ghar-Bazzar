import Jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { responseToClient } from "@utils/response";
import redisClient, { isRedisReady } from "@src/redisClient";
import { AuthenticatedRequest } from "@src/types/authRequest";
import { decryptPayload } from "@utils/decryptPayload";
import userService from "@services/user/userService";
import { TokenPayload } from "@utils/generateToken";

// const deny = (req: Request, res: Response, message: string) => {
//   console.warn(`[AUTH] 401 ${req.method} ${req.originalUrl} - ${message}`);
//   return responseToClient(res, false, 401, message);
// };

export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return responseToClient(
      res,
      false,
      401,
      "Authorization header is missing!",
    );
  }

  if (!authHeader.startsWith("Bearer ")) {
    return responseToClient(
      res,
      false,
      401,
      "Authorization format must be: Bearer <token>",
    );
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return responseToClient(res, false, 401, "Access token is missing!");
  }

  try {
    if (isRedisReady()) {
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) {
        return responseToClient(
          res,
          false,
          401,
          "Token is blacklisted. Please login again!",
        );
      }
    }

    const tokenVerify = Jwt.verify(
      token,
      process.env.JWT_KEY_ACCESS_TOKEN as string,
    ) as Jwt.JwtPayload;

    const encryptedData = tokenVerify?.data;
    if (!encryptedData) {
      return responseToClient(res, false, 401, "Token payload is invalid!");
    }

    const decrypted = decryptPayload(encryptedData);
    const payload: TokenPayload = JSON.parse(decrypted);
    const id = payload?.user?.id;

    if (!id) {
      return responseToClient(
        res,
        false,
        401,
        "Token user payload is missing!",
      );
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return responseToClient(
        res,
        false,
        401,
        "User for this token does not exist!",
      );
    }

    req.user = {
      userId: id,
      email: user.email ?? "",
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof Jwt.TokenExpiredError) {
      return responseToClient(
        res,
        false,
        401,
        "Token expired. Please login again!",
      );
    }

    if (error instanceof Jwt.JsonWebTokenError) {
      return responseToClient(res, false, 401, "Invalid token!");
    }

    return responseToClient(res, false, 401, "Invalid or expired token!");
  }
};

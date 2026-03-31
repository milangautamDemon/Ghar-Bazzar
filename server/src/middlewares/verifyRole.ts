import { UserRole } from "@models/user/userRoleEnum";
import userService from "@services/user/userService";
import { responseToClient } from "@utils/response.js";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "./errorMiddleware";

export const verifyRole = (role: UserRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.user;
      if (!userId) {
        return responseToClient(res, false, 400, "User ID is Required!");
      }
      const user = await userService.getUserById(userId);
      if (!user) {
        return responseToClient(res, false, 404, "User not found!");
      }
      const userRole = user.role;
      const roleAccessed = role === userRole;
      if (!roleAccessed) {
        return responseToClient(
          res,
          false,
          401,
          "Unauthorized access.Contact your administrator for assistance.",
        );
      }
      next();
    } catch (err) {
      errorHandler(err as Error, res);
    }
  };
};

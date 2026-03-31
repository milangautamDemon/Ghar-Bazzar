import { Request } from "express";
import { UserRole } from "@models/user/userRoleEnum";

export type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
    name: string;
    role: UserRole;
  };
};

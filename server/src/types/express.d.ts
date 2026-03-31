import { UserRole } from "@models/user/userRoleEnum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        name: string;
        role: UserRole;
      };
      tokenPayload?: {
        user: {
          id: string;
        };
      };
    }
  }
}

export {};

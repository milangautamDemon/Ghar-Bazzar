import { PAYMENT_METHOD } from "@models/payments/paymentEnum";
import { UserDocument } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // The authenticated user object
      tokenPayload?: {
        user: {
          id: string;
        };
      }; // Decoded token payload
    }
  }
}

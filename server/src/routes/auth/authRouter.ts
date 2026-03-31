import authController from "@controllers/auth/authController";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/register", authController.registerController);
authRouter.post("/login", authController.loginController);

export default authRouter;

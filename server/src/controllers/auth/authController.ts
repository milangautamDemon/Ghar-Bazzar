import User from "@models/user/userModel";
import { generateTokens, TokenPayload } from "@utils/generateToken";
import { responseToClient } from "@utils/response";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { errorHandler } from "@middlewares/errorMiddleware";
import { payloadValidator } from "@utils/payloadValidator";

export const registerController: RequestHandler = async (req, res) => {
  try {
    payloadValidator(req);

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return responseToClient(
        res,
        false,
        400,
        "Name, email and password are required !",
      );
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseToClient(res, false, 400, "Email already exists !");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return responseToClient(res, true, 201, "User registered successfully !");
  } catch (error) {
    errorHandler(error as Error, res);
  }
};

export const loginController: RequestHandler = async (req, res) => {
  try {
    payloadValidator(req);

    const { email, password } = req.body;
    if (!email || !password) {
      return responseToClient(
        res,
        false,
        400,
        "Email and password are required !",
      );
    }
    const verifyPassword = await User.findOne({ email });
    if (!verifyPassword) {
      return responseToClient(res, false, 400, "Invalid email or password !");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      verifyPassword.password,
    );
    if (!isPasswordValid) {
      return responseToClient(res, false, 400, "Invalid email or password !");
    }

    const tokenPayload: TokenPayload = {
      user: {
        id: verifyPassword._id.toString(),
      },
    };

    const { accessToken } = generateTokens(tokenPayload);
    return responseToClient(res, true, 200, "Login successful !", accessToken);
  } catch (error) {
    errorHandler(error as Error, res);
  }
};

export default { registerController, loginController };

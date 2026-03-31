import { CustomError } from "@utils/customError";
import { encryptPayload } from "@utils/encryptPayload";
import Jwt from "jsonwebtoken";

interface UserTokenPayload {
  id: string;
}

export interface TokenPayload {
  user: UserTokenPayload;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (tokenPayload: TokenPayload): Tokens => {
  if (!process.env.JWT_KEY_ACCESS_TOKEN || !process.env.JWT_KEY_REFRESH_TOKEN) {
    throw new CustomError(
      "Secret key are not defined in the environment variables",
      400,
    );
  }

  // Convert payload to string and encrypt it
  const encryptedPayload = encryptPayload(JSON.stringify(tokenPayload));

  // Generate JWT tokens using the encrypted payload
  const accessToken = Jwt.sign(
    { data: encryptedPayload },
    process.env.JWT_KEY_ACCESS_TOKEN,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = Jwt.sign(
    { data: encryptedPayload },
    process.env.JWT_KEY_REFRESH_TOKEN,
    {
      expiresIn: "7d",
    },
  );

  return { accessToken, refreshToken };
};

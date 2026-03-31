import { CustomError } from "./customError";
import crypto from "crypto";

export const encryptPayload = (data: string): string => {
  const algorithm = process.env.ALGORITHM;
  const secretKey = process.env.AES_SECRET_KEY; // Store this secret key in .env file

  if (!secretKey || !algorithm) {
    throw new CustomError(
      "Secret key is not defined in the environment variables",
      400,
    );
  }

  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv,
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Return IV with the encrypted data
};

import crypto from "crypto";
import { CustomError } from "@utils/customError";

export const decryptPayload = (encryptedData: string): string => {
  const algorithm = process.env.ALGORITHM;
  const secretKey = process.env.AES_SECRET_KEY;

  if (!secretKey || !algorithm) {
    throw new CustomError(
      "Secret key is not defined in the environment variables",
      400,
    );
  }

  const [ivHex, encryptedHex] = encryptedData.split(":");
  if (!ivHex || !encryptedHex) {
    throw new CustomError("Invalid! unauthorized to perform this task", 400);
  }

  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv,
  );

  let decrypted = decipher.update(encryptedText, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted; // This will be your original JSON string
};

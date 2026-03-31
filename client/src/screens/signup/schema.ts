import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters !" })
      .max(20, { message: "Name must be less than 20 characters !" }),
    email: z.string().email({ message: "Invalid email address !" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters !" }),
    confirmPassword: z.string().min(6, { message: "Confirm your password !" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match !",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

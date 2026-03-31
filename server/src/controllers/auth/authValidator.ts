import { body } from "express-validator";

interface RequestBody {
  password: string;
  confirmPassword: string;
}

// Validation Middleware for Signup
export const validateRegister = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Please enter name !")
    .isString()
    .withMessage("Name must be a string !")
    .isLength({ min: 2, max: 20 })
    .withMessage("Name must be between 2 and 20 characters !")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain alphabetic characters and spaces !"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter your email !")
    .isEmail()
    .withMessage("Please use a valid email address (example@example.com) !")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Email contains invalid characters or formatting !")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please, enter your new password !")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long !")
    .custom((value: string) => {
      if (!/[A-Z]/.test(value)) {
        throw new Error(
          "Password must contain at least one uppercase letter !",
        );
      }
      if (!/[a-z]/.test(value)) {
        throw new Error(
          "Password must contain at least one lowercase letter !",
        );
      }
      if (!/[0-9]/.test(value)) {
        throw new Error("Password must contain at least one number !");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        throw new Error(
          "Password must contain at least one special character !",
        );
      }
      return true;
    }),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Please, enter your confirm password!")
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Password and confirm password must match!");
      }
      return true;
    }),
].filter(Boolean);

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Please enter your email !")
    .isEmail()
    .withMessage("Please use a valid email address (example@example.com) !")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Please, enter your password !"),
].filter(Boolean);

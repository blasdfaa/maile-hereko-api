import { body } from "express-validator";

const MIN_PASSWORD_LENGTH = 5;

export const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail({ all_lowercase: true, gmail_convert_googlemaildotcom: true })
    .withMessage({
      message: "Invalid email format",
    }),
  body("password")
    .isLength({
      min: MIN_PASSWORD_LENGTH,
    })
    .withMessage({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    }),
];

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: MIN_PASSWORD_LENGTH }),
];

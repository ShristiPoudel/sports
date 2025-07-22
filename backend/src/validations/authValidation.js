import { body } from "express-validator";

// Validation for /register
export const validateRegister = [
  body("username")
    .notEmpty().withMessage("Username is required"),

  body("email")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

  body("role")
    .notEmpty().withMessage("Role is required"),
];

// Validation for /login
export const validateLogin = [
  body("email")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

// Validation for /refresh and /logout
export const validateRefreshOrLogout = [
  body("refreshToken")
    .notEmpty().withMessage("Refresh token is required"),
];

import { body } from "express-validator";

export const createTechnicianValidation = [
  body("userID")
    .isInt({ min: 1 })
    .withMessage("userID must be a valid integer"),

  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ max: 20 })
    .withMessage("Phone must not exceed 20 characters")
];

export const updateTechnicianValidation = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters"),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone must not exceed 20 characters")
];

export const createTechnicianByAdminValidation = [
  body("firstName").notEmpty().isLength({ min: 2, max: 50 }),
  body("lastName").notEmpty().isLength({ min: 2, max: 50 }),
  body("email").notEmpty().isEmail(),
  body("phone").optional().isLength({ max: 20 }),
  body("password").notEmpty().isLength({ min: 6 }),
];


import { body } from "express-validator";

export const createCustomerValidation = [
  body("userID")
    .notEmpty()
    .withMessage("userID is required")
    .isInt({ gt: 0 })
    .withMessage("userID must be a positive integer"),

  body("firstName")
    .notEmpty()
    .withMessage("firstName is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("firstName must be between 2 to 50 characters"),

  body("lastName")
    .notEmpty()
    .withMessage("lastName is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("lastName must be between 2 to 50 characters"),

  body("address")
    .optional()
    .isLength({ max: 50 })
    .withMessage("address must be at most 50 characters"),

  body("city")
    .optional()
    .isLength({ max: 50 })
    .withMessage("city must be at most 50 characters"),

  body("state")
    .optional()
    .isLength({ max: 50 })
    .withMessage("state must be at most 50 characters"),

  body("postalCode")
    .optional()
    .isLength({ max: 20 })
    .withMessage("postalCode must be at most 20 characters"),

  body("phone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("phone must be at most 20 characters"),
];

export const updateCustomerValidation = [
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("firstName must be between 2 to 50 characters"),

  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("lastName must be between 2 to 50 characters"),

  body("address")
    .optional()
    .isLength({ max: 50 })
    .withMessage("address must be at most 50 characters"),

  body("city")
    .optional()
    .isLength({ max: 50 })
    .withMessage("city must be at most 50 characters"),

  body("state")
    .optional()
    .isLength({ max: 50 })
    .withMessage("state must be at most 50 characters"),

  body("postalCode")
    .optional()
    .isLength({ max: 20 })
    .withMessage("postalCode must be at most 20 characters"),

  body("phone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("phone must be at most 20 characters"),
];

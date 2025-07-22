import { body } from "express-validator";

export const createProductValidation = [
  body("productCode")
    .notEmpty()
    .withMessage("Product code is required")
    .isLength({ max: 10 })
    .withMessage("Product code max length is 10"),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name max length is 50"),

  body("version")
    .notEmpty()
    .withMessage("Version is required")
    .isFloat({ min: 0 })
    .withMessage("Version must be a positive number"),

  body("releaseDate")
    .notEmpty()
    .withMessage("Release date is required")
    .isISO8601()
    .withMessage("Release date must be a valid date (YYYY-MM-DD)"),
];

export const updateProductValidation = [
  body("productCode")
    .optional()
    .isLength({ max: 10 })
    .withMessage("Product code max length is 10"),

  body("name")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Name max length is 50"),

  body("version")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Version must be a positive number"),

  body("releaseDate")
    .optional()
    .isISO8601()
    .withMessage("Release date must be a valid date (YYYY-MM-DD)"),
];

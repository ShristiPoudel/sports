import { body } from "express-validator";

// validation to create country code and name
export const createCountryValidation = [
  body("countryCode")
    .notEmpty()
    .withMessage("countryCode is required")
    .isLength({ min: 2, max: 2 })
    .withMessage("countryCode must be exactly 2 uppercase letters")
    .isUppercase()
    .withMessage("countryCode must be in uppercase")
    .matches(/^[A-Z]{2}$/)
    .withMessage("countryCode must contain only uppercase letters"),

  body("countryName")
    .notEmpty()
    .withMessage("countryName is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("countryName must be between 2 and 50 characters"),
];

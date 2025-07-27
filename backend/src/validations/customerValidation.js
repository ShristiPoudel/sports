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

  body("countryCode")
    .notEmpty()
    .withMessage("countryCode is required")
    .isLength({ min: 2, max: 2 })
    .withMessage("countryCode must be exactly 2 characters")
    .isAlpha()
    .withMessage("countryCode must contain only letters")
    .toUpperCase(),
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
  
   body("countryCode")
    .notEmpty()
    .withMessage("countryCode is required")
    .isLength({ min: 2, max: 2 })
    .withMessage("countryCode must be exactly 2 characters")
    .isAlpha()
    .withMessage("countryCode must contain only letters")
    .toUpperCase(),
];


export const createCustomerByAdminValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("firstName")
    .notEmpty()
    .withMessage("firstName is required")
    .isLength({ min: 2, max: 50 }),

  body("lastName")
    .notEmpty()
    .withMessage("lastName is required")
    .isLength({ min: 2, max: 50 }),

  body("address")
    .optional()
    .isLength({ max: 50 }),

  body("city")
    .optional()
    .isLength({ max: 50 }),

  body("state")
    .optional()
    .isLength({ max: 50 }),

  body("postalCode")
    .optional()
    .isLength({ max: 20 }),

  body("phone")
    .optional()
    .isLength({ max: 20 }),

  body("countryCode")
    .notEmpty()
    .withMessage("countryCode is required")
    .isLength({ min: 2, max: 2 })
    .isAlpha()
    .toUpperCase()
];

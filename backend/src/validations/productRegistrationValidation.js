import { body } from "express-validator";

// Validation for registering a product
export const registerProductValidation = [
  body("customerID")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isInt({ gt: 0 })
    .withMessage("Customer ID must be a positive integer"),

  body("productCode")
    .notEmpty()
    .withMessage("Product Code is required")
    .isString()
    .withMessage("Product Code must be a string")
    .isLength({ max: 20 })
    .withMessage("Product Code must be at most 20 characters"),
];

import { body } from "express-validator";

// Validation for creating a new incident (by admin or customer)
export const createIncidentValidation = [
  body("productCode")
    .notEmpty()
    .withMessage("Product code is required")
    .isString()
    .withMessage("Product code must be a string"),

  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 50 })
    .withMessage("Title must be at most 50 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),

  body("dateOpened")
    .optional()
    .isISO8601()
    .withMessage("Date opened must be a valid date"),
];

// Validation for updating an incident
export const updateIncidentValidation = [
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),

  body("dateClosed")
    .optional()
    .isISO8601()
    .withMessage("Date closed must be a valid date"),
];

// Validation for assigning a technician 
export const assignTechnicianValidation = [
  body("techID")
    .notEmpty()
    .withMessage("Technician ID is required")
    .isInt({ gt: 0 })
    .withMessage("Technician ID must be a positive integer"),
];

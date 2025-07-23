import { Router } from "express";
import CustomerController from "../controllers/customerController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { createCustomerValidation, updateCustomerValidation } from "../validations/customerValidation.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

const customerController = new CustomerController();

//Get all customer
router.get("/", 
  verifyToken,
  authorizeRoles("admin"),
  (req, res, next) => {
  customerController.getAllCustomers(req, res, next);
});

//get a specific customer
router.get("/:customerID",
  verifyToken,
  authorizeRoles("admin","customer"),
   (req, res, next) => {
  customerController.getCustomerById(req, res, next);
});


//add customerdata
router.post("/add",
  verifyToken,
  authorizeRoles("admin", "customer"),
  createCustomerValidation,
  validateRequest,
   (req, res, next) => {
  customerController.addCustomer(req, res, next);
});

//update customer
router.put("/update/:customerID",
  verifyToken,
  authorizeRoles("admin","customer"),
  updateCustomerValidation,
  validateRequest,
   (req, res, next ) => {
  customerController.updateCustomer(req, res, next);
});

// DELETE customer
router.delete("/delete/:customerID", 
  verifyToken,
  authorizeRoles("admin","customer"),
  (req, res, next ) => {
  customerController.deleteCustomer(req, res, next);
});

//  allow searching by lastName for admin and customer
router.get(
  "/search/lastName",
  verifyToken,
  authorizeRoles("admin"),
  (req, res, next ) => customerController.searchByLastName(req, res,next )
);


export default router;
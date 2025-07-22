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
  (req, res) => {
  customerController.getAllCustomers(req, res);
});

//get a specific customer
router.get("/:customerID",
  verifyToken,
  authorizeRoles("admin","customer"),
   (req, res) => {
  customerController.getCustomerById(req, res);
});


//add customerdata
router.post("/add",
  verifyToken,
  authorizeRoles("admin", "customer"),
  createCustomerValidation,
  validateRequest,
   (req, res) => {
  customerController.addCustomer(req, res);
});

//update customer
router.put("/update/:customerID",
  verifyToken,
  authorizeRoles("admin","customer"),
  updateCustomerValidation,
  validateRequest,
   (req, res) => {
  customerController.updateCustomer(req, res);
});

// DELETE customer
router.delete("/delete/:customerID", 
  verifyToken,
  authorizeRoles("admin","customer"),
  (req, res) => {
  customerController.deleteCustomer(req, res);
});

//  allow searching by lastName for admin and customer
router.get(
  "/search/lastName",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => customerController.searchByLastName(req, res)
);


export default router;
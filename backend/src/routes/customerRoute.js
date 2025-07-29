import { Router } from "express";
import CustomerController from "../controllers/customerController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { createCustomerValidation, updateCustomerValidation } from "../validations/customerValidation.js";
import validateRequest from "../middlewares/validateRequest.js";
import { createCustomerByAdminValidation } from "../validations/customerValidation.js";

const router = Router();

const customerController = new CustomerController();

router.get("/", 
  verifyToken,
  authorizeRoles("admin"),
  (req, res, next) => {
  customerController.getAllCustomers(req, res, next);
});

router.get("/me",
  verifyToken,
  authorizeRoles("customer", "admin"), 
  (req, res, next) => customerController.getMyCustomerData(req, res, next)
);


router.get("/:customerID",
  verifyToken,
  authorizeRoles("admin","customer"),
   (req, res, next) => {
  customerController.getCustomerById(req, res, next);
});



router.post("/add",
  verifyToken,
  authorizeRoles("admin", "customer"),
  createCustomerValidation,
  validateRequest,
   (req, res, next) => {
  customerController.addCustomer(req, res, next);
});

router.put("/update/:customerID",
  verifyToken,
  authorizeRoles("admin","customer"),
  updateCustomerValidation,
  validateRequest,
   (req, res, next ) => {
  customerController.updateCustomer(req, res, next);
});


router.delete("/delete/:customerID", 
  verifyToken,
  authorizeRoles("admin"),
  (req, res, next ) => {
  customerController.deleteCustomer(req, res, next);
});

router.get(
  "/search/lastName",
  verifyToken,
  authorizeRoles("admin"),
  (req, res, next ) => customerController.searchByLastName(req, res,next )
);


router.post("/addbyadmin",
  verifyToken,
  authorizeRoles("admin"),
  createCustomerByAdminValidation,
  validateRequest,
  (req, res, next) => customerController.addCustomerByAdmin(req, res, next)
);



export default router;
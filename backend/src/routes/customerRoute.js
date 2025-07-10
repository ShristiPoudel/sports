import { Router } from "express";
import CustomerController from "../controllers/customerController.js";

const router = Router();

const customerController = new CustomerController();

//get all customer
router.get("/", (req, res) => {
  customerController.getAllCustomers(req, res);
});

//add customer
router.post("/add", (req, res) => {
  customerController.addCustomer(req, res);
});

//get a specific customer
router.get("/:customerID", (req, res) => {
  customerController.getCustomerById(req, res);
});

//update customer
router.put("/update/:customerID", (req, res) => {
  customerController.updateCustomer(req, res);
});

// search customer by last name
router.get("/search/lastName", (req, res) => {
  customerController.searchByLastName(req, res);
});

// DELETE customer
router.delete("/delete/:customerID", (req, res) => {
  customerController.deleteCustomer(req, res);
});


// login customer 
router.post('/login', (req, res) => customerController.loginCustomer(req, res));




export default router;
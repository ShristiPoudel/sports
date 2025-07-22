import { Customer, Country } from "../models/index.js";
import { Op } from "sequelize";

export default class CustomerController {
  //get all customers
  async getAllCustomers(req, res) {
    try {
      const customers = await Customer.findAll();
      res.json({ success: true, data: customers }); 
    } catch (err) {
      console.error("Fetch all customers error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
  

  // Add a new customer
  async addCustomer(req, res) {
   
  
    // Authorization check
    if (req.user.role !== "admin" && req.user.id !== req.body.userID) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
  
    try {
      const data = await Customer.create(req.body);
      res.status(201).json({ success: true, customer: data });
    } catch (err) {
      console.error("Customer creation error:", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
  

  //get customer by their id
  async getCustomerById(req, res) {
    const { customerID } = req.params;

    if (!customerID) {
      return res.status(400).json({ success: false, message: "Customer ID is required" });
    }

    try {
      const customer = await Customer.findByPk(customerID);

      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      // Access check: Only admin or the customer who owns the data
      if (req.user.role !== "admin" && req.user.id !== customer.userID)
       {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      return res.json({ success: true, data: customer });
    } catch (err) {
      console.error("Error fetching customer:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }
  

  //update customer by their id

  async updateCustomer(req, res) {
    const { customerID } = req.params;

    if (!customerID) {
      return res
        .status(400)
        .json({ success: false, message: "Customer Id is required" });
    }

    try {

      const existingCustomer = await Customer.findByPk(customerID);
      if (!existingCustomer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== existingCustomer.userID) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      const data = await Customer.update(req.body, {
        where: { customerID },
      });

      if (data[0]) {
        res.json({ success: true, message: "Customer updated" });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Couldn't update customer" });
      }
    } catch (err) {
      console.error("Customer update error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // search customer by last name
  async searchByLastName(req, res) {
    const { lastName } = req.query;
  
    if (!lastName) {
      return res
        .status(400)
        .json({ success: false, message: "Last name is required" });
    }
  
    try {
      const customers = await Customer.findAll({
        where: {
          lastName: {
            [Op.iLike]: `%${lastName}%`, 
          },
        },
        include: [Country],
      });
  
      if (customers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No customers found with that last name",
        });
      }

      res.json({ success: true, data: customers });
    } catch (err) {
      console.error("Search by last name error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
  
// delete customer data
  async deleteCustomer(req, res) {
    const { customerID } = req.params;
  
    if (!customerID) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }
  
    try {

      const customer = await Customer.findByPk(customerID);
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
  
      //  Allow only admin or self
      if (req.user.role !== "admin" && req.user.id !== customer.userID) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
  
      const deleted = await Customer.destroy({
        where: { customerID },
      });
  
      if (deleted) {
        res.json({ success: true, message: "Customer data deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Customer not found" });
      }
    } catch (err) {
      console.error("Error deleting customer data:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  
  
  
}
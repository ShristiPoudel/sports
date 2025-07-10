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

    if (customerID) {
      try {
        const data = await Customer.findByPk(customerID);
        if (data) {
          res.json(data);
        } else {
          res
            .status(404)
            .json({ success: false, message: "Customer not found" });
        }
      } catch (err) {
        console.error("Customer fetch error:", err);
        res.status(500).json({ success: false, message: err.message });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Customer id is required" });
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
  

  async deleteCustomer(req, res) {
    const { customerID } = req.params;
  
    if (!customerID) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }
  
    try {
      const deleted = await Customer.destroy({
        where: { customerID },
      });
  
      if (deleted) {
        res.json({ success: true, message: "Customer deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Customer not found" });
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  //  customer login
  async loginCustomer(req, res) {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
  
    try {
      const customer = await Customer.findOne({ where: { email } });
  
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
  
      res.json({ success: true, data: customer });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
  
  
}
import { Customer, Country, User } from "../models/index.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

export default class CustomerController {
  //get all customers
  async getAllCustomers(req, res, next) {
    try {
      const data = await Customer.findAll({
        include: {
          model: User,
          attributes: ["email"],
        },
      });
  
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  // get the logged in customer data
  async getMyCustomerData(req, res, next) {
    try {
      const customer = await Customer.findOne({
        where: { userID: req.user.id },
      });

      if (!customer) {
        return res
          .status(404)
          .json({ exists: false, message: "Customer profile not found." });
      }

      res.status(200).json({ exists: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  // Add a new customer
  async addCustomer(req, res, next) {
    // Authorization check
    if (req.user.role !== "admin" && req.user.id !== req.body.userID) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    try {
      // Check if a customer already exists for the given userID
      const existingCustomer = await Customer.findOne({
        where: { userID: req.body.userID },
      });

      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Customer already exists for this userID",
        });
      }
      //  Check if provided countryCode exists
      const country = await Country.findByPk(req.body.countryCode);
      if (!country) {
        return res.status(400).json({
          success: false,
          message: "Invalid countryCode: not found in supported countries",
        });
      }

      // Create new customer if not exists
      const data = await Customer.create(req.body);
      res.status(201).json({ success: true, customer: data });
    } catch (err) {
      next(err);
    }
  }

  //get customer by their id
  async getCustomerById(req, res, next) {
    const { customerID } = req.params;

    if (!customerID) {
      return res
        .status(400)
        .json({ success: false, message: "Customer ID is required" });
    }

    try {
      const customer = await Customer.findByPk(customerID);

      if (!customer) {
        return res
          .status(404)
          .json({ success: false, message: "Customer not found" });
      }

      // Access check: Only admin or the customer who owns the data
      if (req.user.role !== "admin" && req.user.id !== customer.userID) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      return res.json({ success: true, data: customer });
    } catch (err) {
      next(err);
    }
  }

  //update customer by their id

  async updateCustomer(req, res, next) {
    const { customerID } = req.params;

    if (!customerID) {
      return res
        .status(400)
        .json({ success: false, message: "Customer Id is required" });
    }

    try {
      const existingCustomer = await Customer.findByPk(customerID);
      if (!existingCustomer) {
        return res
          .status(404)
          .json({ success: false, message: "Customer not found" });
      }

      if (
        req.user.role !== "admin" &&
        req.user.id !== existingCustomer.userID
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
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
      next(err);
    }
  }

  // search customer by last name
  async searchByLastName(req, res, next) {
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
      next(err);
    }
  }

  // delete customer data
  async deleteCustomer(req, res, next) {
    const { customerID } = req.params;
  
    if (!customerID) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }
  
    try {
      // Fetch the customer
      const customer = await Customer.findByPk(customerID);
  
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }
  
      const userID = customer.userID;
  
      // Delete customer
      await Customer.destroy({ where: { customerID } });
  
      // Delete associated user
      await User.destroy({ where: { userID } });
  
      return res.json({
        success: true,
        message: "Customer and user account deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
  
  async addCustomerByAdmin(req, res, next) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        address,
        city,
        state,
        postalCode,
        phone,
        countryCode,
      } = req.body;

      const username = email.split("@")[0];

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already taken." });
      }

      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res
          .status(400)
          .json({ success: false, message: "Username is already taken." });
      }

      const country = await Country.findByPk(countryCode);
      if (!country) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid country." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "customer",
      });

      const newCustomer = await Customer.create({
        userID: newUser.userID,
        firstName,
        lastName,
        address,
        city,
        state,
        postalCode,
        phone,
        countryCode,
      });

      res.status(201).json({
        success: true,
        message: "Customer created successfully.",
        data: newCustomer,
      });
    } catch (err) {
      next(err);
    }
  }
}

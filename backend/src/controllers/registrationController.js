import { Customer, Product, Registration } from '../models/index.js';

export default class RegistrationController {
  // Get all products registered by a customer
  async getRegistrationsByCustomer(req, res) {
    const { customerId } = req.params;

    try {
      const customer = await Customer.findByPk(customerId, {
        include: {
          model: Product,
          through: { attributes: [] }, 
        },
      });

      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      res.json({ success: true, data: customer.Products });
    } catch (err) {
      console.error("Get registrations error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Register a product for a customer
  async registerProduct(req, res) {
    const { customerID, productCode } = req.body;

    if (!customerID || !productCode) {
      return res.status(400).json({ success: false, message: "Customer ID and Product Code are required" });
    }

    try {
      const registration = await Registration.create({ customerID, productCode });
      res.status(201).json({ success: true, message: "Product registered", data: registration });
    } catch (err) {
      console.error("Register product error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
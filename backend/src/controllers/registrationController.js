import { Customer, Product, Registration } from '../models/index.js';

export default class RegistrationController {
  // Get all products registered by a customer
  async getRegistrationsByCustomer(req, res, next) {
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
      next(err)
    }
  }

  // Register a product for a customer
  async registerProduct(req, res, next) {
    const { customerID, productCode } = req.body;

    try {
        const customer = await Customer.findByPk(customerID);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const product = await Product.findByPk(productCode);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const existingRegistration = await Registration.findOne({
            where: { customerID, productCode }
        });
        if (existingRegistration) {
            return res.status(400).json({ success: false, message: "Product already registered by this customer" });
        }

        const registration = await Registration.create({ customerID, productCode });
        res.status(201).json({ success: true, message: "Product registered", data: registration });

    } catch (err) {
      next(err)
    }
}

}
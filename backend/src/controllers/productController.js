import { Product } from "../models/index.js";

export default class ProductController {
  //add product
  async addProduct(req, res,next) {
    try {
      const data = await Product.create(req.body);
      console.log(data);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }

  // Get all products
  async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAll();
      res.json({ success: true, data: products });
    } catch (err) {
      next(err);
    }
  }

  //get product by their code
  async getProductByCode(req, res , next) {
    const { productCode } = req.params;

    if (productCode) {
      try {
        const data = await Product.findByPk(productCode);
        if (data) {
          res.json(data);
        } else {
          res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }
      } catch (err) {
        next(err);
      }
      
    } else {
      res
        .status(400)
        .json({ success: false, message: "Product code is required" });
    }
  }

  //update product by their code

  async updateProduct(req, res, next) {
    const { productCode } = req.params;

    if (!productCode) {
      return res
        .status(400)
        .json({ success: false, message: "Product code is required" });
    }

    try {
      const data = await Product.update(req.body, {
        where: { productCode },
      });

      if (data[0]) {
        res.json({ success: true, message: "Product updated" });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Couldn't update product" });
      }
    } catch (err) {
      next(err);
    }
    
  }

  // delete product by their code
  async deleteProduct(req, res, next) {
    const { productCode } = req.params;

    if (!productCode) {
      return res
        .status(400)
        .json({ success: false, message: "Product code is required" });
    }

    try {
      const data = await Product.destroy({
        where: { productCode },
      });

      if (data === 1) {
        res.json({ success: true, message: "Product deleted" });
      } else {
        res
          .status(404)
          .json({
            success: false,
            message: "Product not found or already deleted",
          });
      }
    } catch (err) {
      next(err);
    }
    
  }
}
import { Router } from "express";
import ProductController from "../controllers/productController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import {
  createProductValidation,
  updateProductValidation,
} from "../validations/productValidation.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();
const productController = new ProductController();

// Public: anyone can view products
router.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});

router.get("/:productCode", (req, res) => {
  productController.getProductByCode(req, res);
});

// Protected: only admin can add/update/delete
router.post(
  "/add",
  verifyToken,
  authorizeRoles("admin"),
  createProductValidation,
  validateRequest,
  (req, res) => {
    productController.addProduct(req, res);
  }
);

router.put(
  "/update/:productCode",
  verifyToken,
  authorizeRoles("admin"),
  updateProductValidation,
  validateRequest,
  (req, res) => {
    productController.updateProduct(req, res);
  }
);

router.delete(
  "/delete/:productCode",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => {
    productController.deleteProduct(req, res);
  }
);

export default router;

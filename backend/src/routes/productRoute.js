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

router.get("/", (req, res,next) => {
  productController.getAllProducts(req, res,next);
});

router.get("/:productCode", (req, res,next) => {
  productController.getProductByCode(req, res,next);
});

router.post(
  "/add",
  verifyToken,
  authorizeRoles("admin"),
  createProductValidation,
  validateRequest,
  (req, res,next) => {
    productController.addProduct(req, res,next);
  }
);

router.put(
  "/update/:productCode",
  verifyToken,
  authorizeRoles("admin"),
  updateProductValidation,
  validateRequest,
  (req, res,next) => {
    productController.updateProduct(req,res,next);
  }
);

router.delete(
  "/delete/:productCode",
  verifyToken,
  authorizeRoles("admin"),
  (req, res,next) => {
    productController.deleteProduct(req,res,next);
  }
);

export default router;

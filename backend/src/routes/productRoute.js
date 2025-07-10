import { Router } from "express";
import ProductController from "../controllers/productController.js";

const router = Router();

const productController = new ProductController();


router.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
// POST /product/add
router.post("/add", (req, res) => {
  productController.addProduct(req, res);
});

//get product using productCode
router.get("/:productCode", (req, res) => {
  productController.getProductByCode(req, res);
});

//update product using productCode
router.put("/update/:productCode", (req,res)=>{
  productController.updateProduct(req,res);
});

//delete product
router.delete("/delete/:productCode", (req,res)=>{
  productController.deleteProduct(req,res);
});



export default router;
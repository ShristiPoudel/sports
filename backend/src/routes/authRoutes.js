
import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/authController.js";

const router = Router();
const authContoller = new AuthController();

const validateRegister = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").notEmpty().withMessage("Role is required"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", validateRegister, (req, res) => authContoller.register(req, res));
router.post("/login", validateLogin, (req, res) => authContoller.login(req, res));
router.post("/refresh", (req,res) =>authContoller.refreshAccessToken(req,res));
router.post("/logout", (req, res) => authContoller.logout(req, res));


export default router;

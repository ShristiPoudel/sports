// routes/authRoutes.js

import { Router } from "express";
import AuthController from "../controllers/authController.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  validateRegister,
  validateLogin,
  validateRefreshOrLogout,
} from "../validations/authValidation.js";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRegister,
  validateRequest,
  (req, res) => authController.register(req, res)
);

router.post(
  "/login",
  validateLogin,
  validateRequest,
  (req, res) => authController.login(req, res)
);

router.post(
  "/refresh",
  validateRefreshOrLogout,
  validateRequest,
  (req, res) => authController.refreshAccessToken(req, res)
);

router.post(
  "/logout",
  validateRefreshOrLogout,
  validateRequest,
  (req, res) => authController.logout(req, res)
);

export default router;

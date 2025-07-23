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
  (req, res,next) => authController.register(req, res,next)
);

router.post(
  "/login",
  validateLogin,
  validateRequest,
  (req, res,next) => authController.login(req, res, next)
);

router.post(
  "/refresh",
  validateRefreshOrLogout,
  validateRequest,
  (req, res, next) => authController.refreshAccessToken(req, res, next)
);

router.post(
  "/logout",
  validateRefreshOrLogout,
  validateRequest,
  (req, res, next) => authController.logout(req, res, next)
);

export default router;

import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import ProfileController from "../controllers/profileController.js";
import profileValidation from "../validations/profileValidation.js"
import validateRequest from "../middlewares/validateRequest.js"

const router = Router();
const profileController = new ProfileController

router.get(
    "/",
    verifyToken,
    (req, res, next) => profileController.getProfile(req, res, next)
  );
  
  
  router.put(
    "/",
    verifyToken,
    profileValidation,
    validateRequest,
    (req, res, next) => profileController.updateProfile(req, res, next)
  );

export default router;

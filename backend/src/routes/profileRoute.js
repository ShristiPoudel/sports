// routes/profileRoute.js
import { Router } from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import ProfileController from "../controllers/profileController.js";
import profileValidation from "../validations/profileValidation.js"
import validateRequest from "../middlewares/validateRequest.js"

const router = Router();
const profileController = new ProfileController

//  Get own profile (Any authenticated user)
router.get(
    "/",
    verifyToken,
    (req, res) => profileController.getProfile(req, res)
  );
  
  //  Update own profile (Any authenticated user)
  router.put(
    "/update",
    verifyToken,
    profileValidation,
    validateRequest,
    (req, res) => profileController.updateProfile(req, res)
  );

export default router;

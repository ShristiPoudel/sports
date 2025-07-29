import { Router } from "express";
import IncidentController from "../controllers/incidentController.js";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
  createIncidentValidation,
  updateIncidentValidation,
  assignTechnicianValidation,
} from "../validations/incidentValidation.js";

const router = Router();
const controller = new IncidentController();


router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "technician"),
  (req, res,next ) => controller.getAllIncidents(req, res,next)
);


router.get("/assigned", verifyToken, authorizeRoles("technician"), (req, res,next) =>
  controller.getAssignedIncidents(req, res,next)
);


router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "technician"),
  (req, res,next) => controller.getIncidentById(req, res,next)
);


router.post(
  "/",
  verifyToken,
  authorizeRoles( "customer"),
  createIncidentValidation,
  validateRequest,
  (req, res,next) => controller.createIncident(req, res,next)
);


router.put(
  "/:id/assign",
  verifyToken,
  authorizeRoles("admin"),
  assignTechnicianValidation,
  validateRequest,
  (req, res,next) => controller.assignTechnician(req, res,next)
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "technician"),
  updateIncidentValidation,
  validateRequest,
  (req, res,next) => controller.updateIncident(req, res,next)
);



export default router;

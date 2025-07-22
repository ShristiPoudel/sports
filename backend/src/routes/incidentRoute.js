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

//get incidents
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "technician"),
  (req, res) => controller.getAllIncidents(req, res)
);

//get incident by id
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "technician"),
  (req, res) => controller.getIncidentById(req, res)
);

//post incident
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "customer"),
  createIncidentValidation,
  validateRequest,
  (req, res) => controller.createIncident(req, res)
);

//assign technician
router.put(
  "/:id/assign",
  verifyToken,
  authorizeRoles("admin"),
  assignTechnicianValidation,
  validateRequest,
  (req, res) => controller.assignTechnician(req, res)
);

// PUT update incident details (description, close)
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "technician"),
  updateIncidentValidation,
  validateRequest,
  (req, res) => controller.updateIncident(req, res)
);

// GET /api/incidents/assigned - Technician's assigned incidents
router.get("/assigned", verifyToken, authorizeRoles("technician"), (req, res) =>
  controller.getAssignedIncidents(req, res)
);

export default router;

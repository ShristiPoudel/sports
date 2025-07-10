import { Router } from 'express';
import IncidentController from "../controllers/incidentController.js";

const router = Router();
const controller = new IncidentController();

//get incidents
router.get('/', (req, res) => controller.getAllIncidents(req, res));

//get incident by id
router.get('/:id', (req, res) => controller.getIncidentById(req, res));

//post incident
router.post('/', (req, res) => controller.createIncident(req, res));

//assign technician
router.put('/:id/assign', (req, res) => controller.assignTechnician(req, res));

//updata incident
router.put('/:id', (req, res) => controller.updateIncident(req, res));


export default router;
import { Router } from 'express';
import RegistrationController from "../controllers/registrationController.js"

const router = Router();
const registrationController = new RegistrationController();

// GET /api/registrations/:customerId
router.get('/:customerId', (req, res) => registrationController.getRegistrationsByCustomer(req, res));

// POST /api/registrations
router.post('/', (req, res) => registrationController.registerProduct(req, res));

export default router;
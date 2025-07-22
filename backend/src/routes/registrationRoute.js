import { Router } from 'express';
import RegistrationController from "../controllers/registrationController.js"
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';
import { registerProductValidation } from '../validations/productRegistrationValidation.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const registrationController = new RegistrationController();


// GET /api/registrations/:customerId
router.get('/:customerId',
    verifyToken,
    authorizeRoles('admin', 'customer'),
     (req, res) => registrationController.getRegistrationsByCustomer(req, res));

// POST /api/registrations
router.post('/', 
    verifyToken,
    authorizeRoles('admin', 'customer'),
    registerProductValidation,
    validateRequest,
    (req, res) => registrationController.registerProduct(req, res));

export default router;
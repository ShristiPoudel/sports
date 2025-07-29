import { Router } from 'express';
import RegistrationController from "../controllers/registrationController.js"
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';
import { registerProductValidation } from '../validations/productRegistrationValidation.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const registrationController = new RegistrationController();

router.get('/:customerId',
    verifyToken,
    authorizeRoles('admin', 'customer'),
     (req, res, next) => registrationController.getRegistrationsByCustomer(req, res, next));


router.post('/', 
    verifyToken,
    authorizeRoles('admin', 'customer'),
    registerProductValidation,
    validateRequest,
    (req, res, next) => registrationController.registerProduct(req, res, next));

export default router;
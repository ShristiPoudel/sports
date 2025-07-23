import { Router } from 'express';
import CountryController from '../controllers/countryController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';
import { createCountryValidation } from '../validations/countryValidation.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const countryController = new CountryController();

// GET /api/countries - fetch all
router.get('/', (req, res,next) =>  countryController.getAllCountries(req, res,next));

// POST /api/countries - create new-create new (protected: admin only)
router.post('/add', 
    verifyToken,
    authorizeRoles("admin"),
    createCountryValidation,
    validateRequest,
    (req, res,next) =>  countryController.createCountry(req, res,next));

export default router;
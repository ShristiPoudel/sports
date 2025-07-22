import { Router } from 'express';
import CountryController from '../controllers/countryController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/roleMiddleware.js';
import { createCountryValidation } from '../validations/countryValidation.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const countryController = new CountryController();

// GET /api/countries - fetch all
router.get('/', (req, res) =>  countryController.getAllCountries(req, res));

// POST /api/countries - create new-create new (protected: admin only)
router.post('/add', 
    verifyToken,
    authorizeRoles("admin"),
    createCountryValidation,
    validateRequest,
    (req, res) =>  countryController.createCountry(req, res));

export default router;
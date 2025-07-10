import { Router } from 'express';
import CountryController from '../controllers/countryController.js';

const router = Router();
const countryController = new CountryController();

// GET /api/countries - fetch all
router.get('/', (req, res) =>  countryController.getAllCountries(req, res));

// POST /api/countries - create new
router.post('/add', (req, res) =>  countryController.createCountry(req, res));

export default router;
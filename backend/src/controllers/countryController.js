import { Country } from '../models/index.js';
import { validationResult } from 'express-validator';

export default class CountryController {

  // GET /api/countries - Get all countries
  async getAllCountries(req, res) {
    try {
      const countries = await Country.findAll();
      res.json({ success: true, data: countries });
    } catch (err) {
      console.error("Error fetching countries:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/countries - Add a new country
  async createCountry(req, res) {
    
    const { countryCode, countryName } = req.body;

    try {

        // Check for duplicate countryCode
        const exists = await Country.findOne({ where: { countryCode } });
        if (exists) {
          return res.status(409).json({ success: false, message: "Country with this code already exists" });
        }
  
        // Check for duplicate countryName
        const nameExists = await Country.findOne({ where: { countryName } });
        if (nameExists) {
          return res.status(409).json({ success: false, message: "Country name already exists" });
        }
        
      const data = await Country.create({ countryCode, countryName });
      res.status(201).json({ success: true, message: "Country created", data: data });
    } catch (err) {
      console.error("Error creating country:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
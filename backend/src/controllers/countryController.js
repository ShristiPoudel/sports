import { Country } from '../models/index.js';

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

    if (!countryCode || !countryName) {
      return res.status(400).json({ success: false, message: "countryCode and countryName are required" });
    }

    try {
      const data = await Country.create({ countryCode, countryName });
      res.status(201).json({ success: true, message: "Country created", data: data });
    } catch (err) {
      console.error("Error creating country:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
import { Technician,User} from "../models/index.js";
import bcrypt from "bcryptjs";

export default class TechnicianController {
  // GET all technicians
  async getAllTechnicians(req, res, next) {
    try {
      const data = await Technician.findAll({
        include: [{
          model: User,
          attributes: ['email'] // only select email from User
        }]
      });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  // GET technician by ID
  async getTechnicianById(req, res, next) {
    const { techID } = req.params;

    if (!techID) {
      return res.status(400).json({ success: false, message: "Technician ID is required" });
    }

    try {
      const data = await Technician.findByPk(techID);

      if (!data) {
        return res.status(404).json({ success: false, message: "Technician not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== data.userID) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      res.json({ success: true, data });
    } catch (err) {
      next(err)
    }
  }

    // GET /api/technicians/me - Get logged-in technician's profile
    async getMyTechnicianData(req, res, next) {
      try {
        // Assuming req.user.id is set by your auth middleware
        const technician = await Technician.findOne({
          where: { userID: req.user.id },
        });
  
        if (!technician) {
          return res
            .status(404)
            .json({ exists: false, message: "Technician profile not found." });
        }
  
        res.status(200).json({ exists: true, data: technician });
      } catch (err) {
        next(err);
      }
    }
  

  // POST: Add technician
  async addTechnician(req, res, next) {
    // Authorization check
    if (req.user.role !== "admin" && req.user.id !== req.body.userID) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
  
    try {
      // Check if technician already exists for given userID
      const existingTechnician = await Technician.findOne({
        where: { userID: req.body.userID }
      });
  
      if (existingTechnician) {
        return res.status(400).json({
          success: false,
          message: "Technician already exists for this userID"
        });
      }
  
      // Create technician if not already exists
      const data = await Technician.create(req.body);
      res.status(201).json({ success: true, technician: data });
    } catch (err) {
      next(err);
    }
  }
  

  // PUT: Update technician
  async updateTechnician(req, res, next) {
    const { techID } = req.params;

    if (!techID) {
      return res.status(400).json({ success: false, message: "Technician ID is required" });
    }

    try {
      const existing = await Technician.findByPk(techID);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Technician not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== existing.userID) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      const updated = await Technician.update(req.body, {
        where: { techID },
      });

      if (updated[0]) {
        res.json({ success: true, message: "Technician updated" });
      } else {
        res.status(400).json({ success: false, message: "Technician update failed" });
      }
    } catch (err) {
      next(err)
    }
  }

  // DELETE technician
  async deleteTechnician(req, res, next) {
    const { techID } = req.params;
  
    if (!techID) {
      return res.status(400).json({
        success: false,
        message: "Technician ID is required",
      });
    }
  
    try {
      // Find technician
      const technician = await Technician.findByPk(techID);
      if (!technician) {
        return res.status(404).json({
          success: false,
          message: "Technician not found",
        });
      }
  
      const userID = technician.userID;
  
      // Delete technician record
      await Technician.destroy({ where: { techID } });
  
      // Delete associated user record
      await User.destroy({ where: { userID } });
  
      res.json({
        success: true,
        message: "Technician and associated user account deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
  

  async addTechnicianByAdmin(req, res, next) {
    try {
      const { firstName, lastName, email, phone, password } = req.body;

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        username: email.split("@")[0],
        email,
        password: hashed,
        role: "technician",
      });

      const technician = await Technician.create({
        userID: user.userID,
        firstName,
        lastName,
        phone,
      });

      res.status(201).json({ success: true, data: technician });
    } catch (err) {
      next(err);
    }
  }
}

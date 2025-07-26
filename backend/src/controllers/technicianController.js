import { Technician } from "../models/index.js";

export default class TechnicianController {
  // GET all technicians
  async getAllTechnicians(req, res, next) {
    try {
      const data = await Technician.findAll();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  // GET technician by ID
  async getTechnicianById(req, res, next) {
    const { techID } = req.params;

    if (!techID) {
      return res
        .status(400)
        .json({ success: false, message: "Technician ID is required" });
    }

    try {
      const data = await Technician.findByPk(techID);

      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "Technician not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== data.userID) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      res.json({ success: true, data });
    } catch (err) {
      next(err);
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
        where: { userID: req.body.userID },
      });

      if (existingTechnician) {
        return res.status(400).json({
          success: false,
          message: "Technician already exists for this userID",
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
      return res
        .status(400)
        .json({ success: false, message: "Technician ID is required" });
    }

    try {
      const existing = await Technician.findByPk(techID);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Technician not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== existing.userID) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      const updated = await Technician.update(req.body, {
        where: { techID },
      });

      if (updated[0]) {
        res.json({ success: true, message: "Technician updated" });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Technician update failed" });
      }
    } catch (err) {
      next(err);
    }
  }

  // DELETE technician
  async deleteTechnician(req, res, next) {
    const { techID } = req.params;

    if (!techID) {
      return res
        .status(400)
        .json({ success: false, message: "Technician ID is required" });
    }

    try {
      const technician = await Technician.findByPk(techID);
      if (!technician) {
        return res
          .status(404)
          .json({ success: false, message: "Technician not found" });
      }

      if (req.user.role !== "admin" && req.user.id !== technician.userID) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }

      const deleted = await Technician.destroy({
        where: { techID },
      });

      if (deleted) {
        res.json({ success: true, message: "Technician deleted successfully" });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Technician deletion failed" });
      }
    } catch (err) {
      next(err);
    }
  }
}

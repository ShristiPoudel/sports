import { Incident, Customer, Product, Technician } from '../models/index.js';

export default class IncidentController {

  // Get all incidents
  async getAllIncidents(req, res) {
    try {
      const incidents = await Incident.findAll({
        include: [Customer, Product, Technician]
      });
      res.json({ success: true, data: incidents });
    } catch (err) {
      console.error("Fetch incidents error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get specific incident by ID
  async getIncidentById(req, res) {
    const { id } = req.params;

    try {
      const incident = await Incident.findByPk(id, {
        include: [Customer, Product, Technician]
      });

      if (!incident) {
        return res.status(404).json({ success: false, message: "Incident not found" });
      }

      res.json({ success: true, data: incident });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Create new incident (reporting)
  async createIncident(req, res) {
    const { customerID, productCode, dateOpened, title, description } = req.body;

    if (!customerID || !productCode || !title || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const incident = await Incident.create({
        customerID,
        productCode,
        dateOpened: dateOpened || new Date(),
        title,
        description,
        techID: null
      });

      res.status(201).json({ success: true, message: "Incident created", data: incident });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Assign incident to technician
  async assignTechnician(req, res) {
    const { id } = req.params;
    const { techID } = req.body;

    if (!techID) {
      return res.status(400).json({ success: false, message: "Technician ID is required" });
    }

    try {
      const [updated] = await Incident.update(
        { techID },
        { where: { incidentID: id } }
      );

      if (updated) {
        res.json({ success: true, message: "Technician assigned" });
      } else {
        res.status(404).json({ success: false, message: "Incident not found" });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  
// Update incident description and optionally close
async updateIncident(req, res) {
  const { id } = req.params;
  const { description, dateClosed } = req.body;

  if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
  }

  try {
      const [updated] = await Incident.update(
          { description, dateClosed: dateClosed || null },
          { where: { incidentID: id } }
      );

      if (updated) {
          res.json({ success: true, message: "Incident updated successfully" });
      } else {
          res.status(404).json({ success: false, message: "Incident not found" });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
  }
}


// Get incidents assigned to the logged-in technician
async getAssignedIncidents(req, res) {
  const { userID, role } = req.user;

  if (role !== 'technician') {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  try {
    const incidents = await Incident.findAll({
      where: { techID: userID },
      include: [Customer, Product, Technician],
    });

    if (!incidents || incidents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No incidents assigned to you currently",
        data: [],
      });
    }

    res.json({
      success: true,
      message: "Assigned incidents retrieved successfully",
      data: incidents,
    });
  } catch (err) {
    console.error("Fetch assigned incidents error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}



}
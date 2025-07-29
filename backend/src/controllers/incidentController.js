import { Incident, Customer, Product, Technician } from "../models/index.js";

export default class IncidentController {
  //GET api/incidents/ -  Get all incidents
  async getAllIncidents(req, res, next) {
    try {
      const incidents = await Incident.findAll({
        include: [Customer, Product, Technician],
      });
      res.json({ success: true, data: incidents });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/incidents/:id -Get specific incident by ID
  async getIncidentById(req, res, next) {
    const { id } = req.params;

    try {
      const incident = await Incident.findByPk(id, {
        include: [Customer, Product, Technician],
      });

      if (!incident) {
        return res
          .status(404)
          .json({ success: false, message: "Incident not found" });
      }

      res.json({ success: true, data: incident });
    } catch (err) {
      next(err);
    }
  }

  //POST api/incidents/  Create new incident 
  async createIncident(req, res, next) {
    const { productCode, dateOpened, title, description } = req.body;
    const userID = req.user.id; 
  
    if (!productCode || !title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
  
    try {
     
      const customer = await Customer.findOne({ where: { userID } });
  
      if (!customer) {
        return res
          .status(400)
          .json({ success: false, message: "Customer not found" });
      }
  
      const incident = await Incident.create({
        customerID: customer.customerID,
        productCode,
        dateOpened: dateOpened || new Date(),
        title,
        description,
        techID: null,
      });
  
      res
        .status(201)
        .json({ success: true, message: "Incident created", data: incident });
    } catch (err) {
      next(err);
    }
  }
  

  //PUT api/incidents//:id/assign - Assign incident to technician
  async assignTechnician(req, res, next) {
    const { id } = req.params;
    const { techID } = req.body;

    if (!techID) {
      return res
        .status(400)
        .json({ success: false, message: "Technician ID is required" });
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
      next(err);
    }
  }


 //PUT api/incidents/:id -  Update incident description and optionally close
async updateIncident(req, res, next) {
  const { id } = req.params;
  const { description, dateClosed } = req.body;

  if (!description) {
    return res
      .status(400)
      .json({ success: false, message: "Description is required" });
  }

  try {
    const incident = await Incident.findByPk(id);

    if (!incident) {
      return res.status(404).json({ success: false, message: "Incident not found" });
    }

    // Only admin or the assigned technician can update
    if (req.user.role !== "admin") {
      const technician = await Technician.findOne({ where: { userID: req.user.id } });

      if (!technician || technician.techID !== incident.techID) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    const updateData = { description };
    if (dateClosed) {
      updateData.dateClosed = dateClosed;
    }
    
    const [updated] = await Incident.update(updateData, {
      where: { incidentID: id },
    });
    

    if (updated) {
      res.json({ success: true, message: "Incident updated successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to update incident" });
    }
  } catch (err) {
    next(err);
  }
}



// GET /api/incidents/assigned - Technician's assigned incidents
async getAssignedIncidents(req, res, next) {
  const { id } = req.user; 

  try {
    
    const technician = await Technician.findOne({ where: { userID: id } });

    if (!technician) {
      return res
        .status(404)
        .json({ success: false, message: "Technician not found" });
    }

    
    const incidents = await Incident.findAll({
      where: { techID: technician.techID },
      include: [Customer, Product, Technician],
      order: [["dateOpened", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message:
        incidents.length === 0
          ? "No incidents assigned to you currently"
          : "Assigned incidents retrieved successfully",
      data: incidents,
    });
  } catch (err) {
    next(err);
  }
}

}

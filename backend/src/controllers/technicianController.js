import { Technician } from '../models/index.js'; 

export default class TechnicianController {
    //add product
    async addTechnician (req, res)  {
        try {
          const data = await Technician.create(req.body);
          console.log(data);
          res.status(201).json(data);
        } catch (err) {
          console.error("Technician creation error:", err);
          res.status(400).json({
            success: false,
            message: err.message,  
          });
        }
      }

      //get all products 
      async getAllTechnicians(req, res) {
        try {
          const data = await Technician.findAll();
          res.json({ success: true, data });
        } catch (err) {
          res.status(500).json({ success: false, message: err.message });
        }
      }
      

      //get product by their code
      async getTechnicianById(req, res) {
        const {techID } = req.params;
      
        if (techID) {
          try {
            const data = await Technician.findByPk(techID);
            if (data) {
              res.json(data);
            } else {
              res.status(404).json({ success: false, message: "Technician not found" });
            }
          } catch (err) {
            console.error("Technician fetch error:", err);
            res.status(500).json({ success: false, message: err.message });
          }
        } else {
          res.status(400).json({ success: false, message: "Technician ID is required" });
        }
      }

      //update product by their code 

      async updateTechnician(req, res) {
        const { techID } = req.params;
    
        if (!techID) {
          return res.status(400).json({ success: false, message: "Technician code is required" });
        }
    
        try {
          const data = await Technician.update(req.body, {
            where: { techID },
          });
    
          if (data[0]) {
            res.json({ success: true, message: "Technician updated" });
          } else {
            res.status(404).json({ success: false, message: "Couldn't update technician" });
          }
        } catch (err) {
          console.error("Technician update error:", err);
          res.status(500).json({ success: false, message: err.message });
        }
      }
   
     // delete product by their code
     async deleteTechnician(req, res) {
      const { techID } = req.params;
    
      if (!techID) {
        return res.status(400).json({ success: false, message: "Technician code is required" });
      }
    
      try {
        const data = await Technician.destroy({
          where: { techID },
        });
    
        if (data === 1) {
          res.json({ success: true, message: "Technician deleted" });
        } else {
          res.status(404).json({ success: false, message: "Technician not found or already deleted" });
        }
      } catch (err) {
        console.error("Technicain deletion error:", err);
        res.status(500).json({ success: false, message: err.message });
      }
    }
} 
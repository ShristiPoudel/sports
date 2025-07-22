import { Router } from "express";
import TechnicianController from "../controllers/technicianController.js";
import verifyToken from "../middlewares/authMiddleware.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"
import { createTechnicianValidation, updateTechnicianValidation } from "../validations/technicianValidation.js";
import validateRequest from "../middlewares/validateRequest.js"

const router = Router();

const technicianController = new TechnicianController();

// View: admin and technician

//get all technicians
router.get("/",
  verifyToken,
  authorizeRoles("admin"),
   (req, res) => {
  technicianController.getAllTechnicians(req, res);
});

//get technician by id
router.get("/:techID",
  verifyToken,
  authorizeRoles("admin", "technician"), (req, res) => {
 technicianController.getTechnicianById(req, res);
});


// POST /product/add - add technician data
router.post("/add",
  verifyToken,
  authorizeRoles("admin","technician"),
  createTechnicianValidation,
  validateRequest,
   (req, res) => {
  technicianController.addTechnician(req, res);
});


//update technician by id
router.put("/update/:techID",
  verifyToken,
  authorizeRoles("admin","technician"),
  updateTechnicianValidation,
  validateRequest,
   (req,res)=>{
  technicianController.updateTechnician(req,res);
});

//delete technician by id
router.delete("/delete/:techID",
  verifyToken,
  authorizeRoles("admin","technician"),
   (req,res)=>{
  technicianController.deleteTechnician(req,res);
});



export default router;
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
   (req, res, next) => {
  technicianController.getAllTechnicians(req, res, next);
});

//get technician by id
router.get("/:techID",
  verifyToken,
  authorizeRoles("admin", "technician"), (req, res, next) => {
 technicianController.getTechnicianById(req, res, next);
});


// POST /product/add - add technician data
router.post("/add",
  verifyToken,
  authorizeRoles("admin","technician"),
  createTechnicianValidation,
  validateRequest,
   (req, res, next) => {
  technicianController.addTechnician(req, res, next);
});


//update technician by id
router.put("/update/:techID",
  verifyToken,
  authorizeRoles("admin","technician"),
  updateTechnicianValidation,
  validateRequest,
   (req,res,next)=>{
  technicianController.updateTechnician(req,res, next);
});

//delete technician by id
router.delete("/delete/:techID",
  verifyToken,
  authorizeRoles("admin","technician"),
   (req, res, next)=>{
  technicianController.deleteTechnician(req,res, next);
});



export default router;
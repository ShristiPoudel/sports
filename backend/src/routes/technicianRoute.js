import { Router } from "express";
import TechnicianController from "../controllers/technicianController.js";
import verifyToken from "../middlewares/authMiddleware.js"
import authorizeRoles from "../middlewares/roleMiddleware.js"
import { createTechnicianValidation, updateTechnicianValidation } from "../validations/technicianValidation.js";
import validateRequest from "../middlewares/validateRequest.js"
import { createTechnicianByAdminValidation } from "../validations/technicianValidation.js";

const router = Router();

const technicianController = new TechnicianController();


router.get("/",
  verifyToken,
  authorizeRoles("admin"),
   (req, res, next) => {
  technicianController.getAllTechnicians(req, res, next);
});


router.get(
  "/me",
  verifyToken,
  authorizeRoles("technician", "admin"), 
  (req, res, next) => {
    technicianController.getMyTechnicianData(req, res, next);
  }
);



router.get("/:techID",
  verifyToken,
  authorizeRoles("admin", "technician"), (req, res, next) => {
 technicianController.getTechnicianById(req, res, next);
});



router.post("/add",
  verifyToken,
  authorizeRoles("admin","technician"),
  createTechnicianValidation,
  validateRequest,
   (req, res, next) => {
  technicianController.addTechnician(req, res, next);
});



router.put("/update/:techID",
  verifyToken,
  authorizeRoles("admin","technician"),
  updateTechnicianValidation,
  validateRequest,
   (req,res,next)=>{
  technicianController.updateTechnician(req,res, next);
});


router.delete("/delete/:techID",
  verifyToken,
  authorizeRoles("admin"),
   (req, res, next)=>{
  technicianController.deleteTechnician(req,res, next);
});


router.post(
  "/addbyadmin",
  verifyToken,
  authorizeRoles("admin"),
  createTechnicianByAdminValidation,
  validateRequest,
  (req, res, next) => technicianController.addTechnicianByAdmin(req, res, next)
);



export default router;
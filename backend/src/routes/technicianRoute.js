import { Router } from "express";
import TechnicianController from "../controllers/technicianController.js";

const router = Router();

const technicianController = new TechnicianController();


router.get("/", (req, res) => {
  technicianController.getAllTechnicians(req, res);
});
// POST /product/add
router.post("/add", (req, res) => {
  technicianController.addTechnician(req, res);
});

//get technician by id
router.get("/:techID", (req, res) => {
 technicianController.getTechnicianById(req, res);
});

//update technician by id
router.put("/update/:techID", (req,res)=>{
  technicianController.updateTechnician(req,res);
});

//delete technician by id
router.delete("/delete/:techID", (req,res)=>{
  technicianController.deleteTechnician(req,res);
});



export default router;
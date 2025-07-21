import {Router} from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
const router = Router();

// Only admin can access this router
router.get("/admin",verifyToken,authorizeRoles("admin"), (req,res)=>{
    res.json({message:"Welcome Admin"})
})

//Both admin and technician can access this router
router.get("/technician",verifyToken,authorizeRoles("admin","technician"),(req,res)=>{
    res.json({message:"Welcome Technician"})
})

//Both admin and customer can access this router
router.get("/customer",verifyToken,authorizeRoles("admin","customer"),(req,res)=>{
    res.json({message:"Welcome Customer"})
})

export default router;
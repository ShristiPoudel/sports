
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"; 
import Customer from "../models/customerModel.js";
import Technician from "../models/technicianModel.js";


export default class ProfileController {
  // GET /api/profile - Get own profile (Any authenticated user)
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["userID", "username", "email", "role"]
      });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      let profileData = user.toJSON(); // convert Sequelize instance to plain object
  
      if (user.role === 'customer') {
        const customer = await Customer.findOne({
          where: { userID: user.userID },
          attributes: ["customerID"]
        });
  
        if (customer) {
          profileData.customerID = customer.customerID;
        }
      } else if (user.role === 'technician') {
        const technician = await Technician.findOne({
          where: { userID: user.userID },
          attributes: ["techID"]
        });
  
        if (technician) {
          profileData.techID = technician.techID;
        }
      }
  
      res.json({ success: true, data: profileData });
    } catch (err) {
      next(err);
    }
  }
  
  // PUT /api/profile  - Update own profile (Any authenticated user)
  async updateProfile(req, res,next) {
    try {
      const { username, email, password } = req.body;
  
      const updateData = { username, email };
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
  
      const [updated] = await User.update(updateData, {
        where: { userID: req.user.id }
      });
  
      if (updated) {
        return res.json({ success: true, message: "Profile updated successfully" });
      } else {
        return res.status(400).json({ success: false, message: "Update failed" });
      }
    } catch (err) {
      next(err)
    }
  }
}

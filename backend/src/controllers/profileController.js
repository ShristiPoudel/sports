// controllers/profileController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"; 

export default class ProfileController {
  // GET /api/profile
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["userID", "username", "email", "role"]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // PUT /api/profile
  async updateProfile(req, res) {
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
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

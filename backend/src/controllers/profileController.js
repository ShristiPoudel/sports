// controllers/profileController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"; 

export default class ProfileController {
  // GET /api/profile
  async getProfile(req, res,next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["userID", "username", "email", "role"]
      });

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (err) {
      next(err)
    }
  }

  // PUT /api/profile
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

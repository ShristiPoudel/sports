import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import "dotenv/config";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import UserToken from "../models/userTokenModel.js";


const JWT_SEC = process.env.JWT_SECRET;

export default class AuthController {

// Post api/auth/register - Register  user
  async register(req, res,next) {
   
    try {
      const { username, email, password, role } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.userID,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      next(err); 
    }
  }

  // Post api/auth/login - login user
  async login(req, res, next) {
   
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      
      // Save refresh token in DB
      await UserToken.create({
        token: refreshToken,
        userID: user.userID,
      });
      
      res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user.userID,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
      
    } catch (err) {
      next(err); 
    }
  }

  // post api/auth/Refresh - get new accessToken
  async refreshAccessToken(req,res, next){
    const { refreshToken } = req.body;

    
    // Find token in DB
  const storedToken = await UserToken.findOne({ where: { token: refreshToken } });


  if (!storedToken) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
    
  } catch (err) {
    next(err); 
  }

}

// Post api/auth - Logout
async logout(req, res, next) {
  const { refreshToken } = req.body;

  

  try {
    // Delete the refresh token from DB
    const deleted = await UserToken.destroy({ where: { token: refreshToken } });

    if (!deleted) {
      return res.status(404).json({ message: "Token not found" });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err); 
  }
}

}



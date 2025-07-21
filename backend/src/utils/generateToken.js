
import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.userID,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.userID },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );
};

import connection from "../config/connection.js";
import { DataTypes } from "sequelize";

// UserToken model for refresh tokens or session management
const UserToken = connection.define('UserToken', {
  tokenID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  // Explicit foreign key for relational integrity
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // References the Users table
      key: 'userID'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
});

export default UserToken;

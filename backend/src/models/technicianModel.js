import connection from "../config/connection.js"
import { DataTypes } from "sequelize"

const Technician = connection.define('Technician', {
  techID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: DataTypes.STRING(50),
  lastName: DataTypes.STRING(50),
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  phone: DataTypes.STRING(20),
  password: DataTypes.STRING(100),
});

export default Technician;
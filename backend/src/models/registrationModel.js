import { DataTypes } from 'sequelize';
import connection from "../config/connection.js";

const Registration = connection.define('Registration', {
  customerID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  productCode: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  registrationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});
export default Registration;
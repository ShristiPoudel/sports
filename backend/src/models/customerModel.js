import connection from "../config/connection.js"
import { DataTypes } from "sequelize";

const Customer = connection.define('Customer', {
  customerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userID'
    },
    onDelete: 'CASCADE'
  },
  firstName: DataTypes.STRING(50),
  lastName: DataTypes.STRING(50),
  address: DataTypes.STRING(50),
  city: DataTypes.STRING(50),
  state: DataTypes.STRING(50),
  postalCode: DataTypes.STRING(20),
  phone: DataTypes.STRING(20),
});

export default Customer;
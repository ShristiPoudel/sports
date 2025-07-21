import connection from "../config/connection.js"
import { DataTypes } from "sequelize";


const Technician = connection.define('Technician', {
  techID: {
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
  phone: DataTypes.STRING(20),
 
});

export default Technician;
import { DataTypes } from 'sequelize';
import connection from "../config/connection.js"

const Administrator = connection.define('Administrator', {
  username: {
    type: DataTypes.STRING(40),
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

export default Administrator;
 
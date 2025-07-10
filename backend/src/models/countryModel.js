import { DataTypes } from "sequelize"
import connection from "../config/connection.js"

const Country = connection.define('Country', {
  countryCode: {
    type: DataTypes.CHAR(2),
    primaryKey: true,
  },
  countryName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

export default Country;


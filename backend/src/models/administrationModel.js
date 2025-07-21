import { DataTypes } from 'sequelize';
import connection from "../config/connection.js"

const Administrator = connection.define('Administrator', {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userID'
    },
    onDelete: 'CASCADE'
  },

});

export default Administrator;
 
import connection from "../config/connection.js"
import { DataTypes } from "sequelize"

const Product = connection.define('Product', {
  productCode: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  version: {
    type: DataTypes.DECIMAL(18, 1),
    allowNull: false,
  },
  releaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

export default Product;
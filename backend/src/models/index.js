import connection from "../config/connection.js"
import Country from './countryModel.js';
import Product from './productModel.js';
import Technician from './technicianModel.js';
import Customer from './customerModel.js';
import Incident from './incidentModel.js';
import Registration from './registrationModel.js';
import Administrator from './administrationModel.js';
import User from "./userModel.js";
import UserToken from "./userTokenModel.js";

// Defining relationships
Country.hasMany(Customer, { foreignKey: 'countryCode' });
Customer.belongsTo(Country, { foreignKey: 'countryCode' });

Customer.hasMany(Incident, { foreignKey: 'customerID', onDelete: 'CASCADE' });
Incident.belongsTo(Customer, { foreignKey: 'customerID' });

Product.hasMany(Incident, { foreignKey: 'productCode' });
Incident.belongsTo(Product, { foreignKey: 'productCode' });

Technician.hasMany(Incident, { foreignKey: 'techID' });
Incident.belongsTo(Technician, { foreignKey: 'techID' });

Customer.belongsToMany(Product, {
  through: Registration,
  foreignKey: 'customerID',
});
Product.belongsToMany(Customer, {
  through: Registration,
  foreignKey: 'productCode',
});

// User to role tables (1-to-1)
User.hasOne(Customer, { foreignKey: 'userID' });
Customer.belongsTo(User, { foreignKey: 'userID' });

User.hasOne(Technician, { foreignKey: 'userID' });
Technician.belongsTo(User, { foreignKey: 'userID' });

User.hasOne(Administrator, { foreignKey: 'userID' });
Administrator.belongsTo(User, { foreignKey: 'userID' });

//  User to UserToken (1-to-many)
User.hasMany(UserToken, { foreignKey: 'userID', onDelete: 'CASCADE' });
UserToken.belongsTo(User, { foreignKey: 'userID' });

// Exporting all
export {
  connection,
  Country,
  Product,
  Technician,
  Customer,
  Incident,
  Registration,
  Administrator,
  User,
  UserToken
};
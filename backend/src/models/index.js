import connection from "../config/connection.js"
import Country from './countryModel.js';
import Product from './productModel.js';
import Technician from './technicianModel.js';
import Customer from './customerModel.js';
import Incident from './incidentModel.js';
import Registration from './registrationModel.js';
import Administrator from './administrationModel.js';

// Defining relationships
Country.hasMany(Customer, { foreignKey: 'countryCode' });
Customer.belongsTo(Country, { foreignKey: 'countryCode' });

Customer.hasMany(Incident, { foreignKey: 'customerID' });
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
};
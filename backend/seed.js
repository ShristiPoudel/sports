import {
    Administrator,
    Country,
    Customer,
    Product,
    Technician,
    Incident,
    Registration
  } from "./src/models/index.js"; 
  import connection from "./src/config/connection.js";
  
  const seed = async () => {
    try {
      console.log("Starting seeding...");
  
      // Completely reset and recreate all tables
      await connection.sync({ force: true });
  
      // Sample countries
      await Country.bulkCreate([
        { countryCode: 'US', countryName: 'United States' },
        { countryCode: 'AU', countryName: 'Australia' },
      ]);
  
      // Admin
      await Administrator.create({
        username: 'admin',
        password: 'admin123'
      });
  
      // Customers
      const customers = await Customer.bulkCreate([
        {
          firstName: 'Alice',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Sydney',
          state: 'NSW',
          postalCode: '2000',
          phone: '0412345678',
          email: 'alice@example.com',
          password: 'alice123',
          countryCode: 'AU'
        },
        {
          firstName: 'Bob',
          lastName: 'Smith',
          address: '456 Market St',
          city: 'Melbourne',
          state: 'VIC',
          postalCode: '3000',
          phone: '0423456789',
          email: 'bob@example.com',
          password: 'bob123',
          countryCode: 'AU'
        },
      ]);
  
      // Products
      const products = await Product.bulkCreate([
        {
          productCode: 'P100',
          name: 'SportsPro Antivirus',
          version: 1.0,
          releaseDate: '2024-01-01',
        },
        {
          productCode: 'P200',
          name: 'SportsPro VPN',
          version: 2.0,
          releaseDate: '2024-06-01',
        },
      ]);
  
      // Technician
      const tech = await Technician.create({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@tech.com',
        phone: '0434567890',
        password: 'tech123'
      });
  
      // Incident
      await Incident.create({
        title: 'Cannot install product',
        description: 'Setup crashes on macOS.',
        customerID: customers[0].customerID,
        productCode: products[0].productCode,
        techID: tech.techID
      });
  
      // Registration
      await Registration.create({
        customerID: customers[0].customerID,
        productCode: products[0].productCode,
      });
  
      console.log(" Seeding completed successfully!");
      process.exit(0);
    } catch (error) {
      console.error(" Error seeding data:", error);
      process.exit(1);
    }
  };
  
  seed();
  
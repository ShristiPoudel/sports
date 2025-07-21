import {
  Administrator,
  Country,
  Customer,
  Product,
  Technician,
  Incident,
  Registration,
  User
} from "./src/models/index.js";
import connection from "./src/config/connection.js";
import bcrypt from "bcryptjs";

const seed = async () => {
  try {
    console.log("Starting seeding...");

    await connection.sync({ force: true });

    // Sample countries
    await Country.bulkCreate([
      { countryCode: 'US', countryName: 'United States' },
      { countryCode: 'AU', countryName: 'Australia' },
    ]);

    // Create Admin User + Admin Profile
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });
    await Administrator.create({
      userID: adminUser.userID
    });

    // Create Customer Users + Profiles
    const customerUsers = await Promise.all([
      User.create({
        username: 'alice123',
        email: 'alice@example.com',
        password: await bcrypt.hash('alice123', 10),
        role: 'customer'
      }),
      User.create({
        username: 'bob123',
        email: 'bob@example.com',
        password: await bcrypt.hash('bob12345', 10),
        role: 'customer'
      })
    ]);

    const customers = await Customer.bulkCreate([
      {
        userID: customerUsers[0].userID,
        firstName: 'Alice',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Sydney',
        state: 'NSW',
        postalCode: '2000',
        phone: '0412345678',
        countryCode: 'AU'
      },
      {
        userID: customerUsers[1].userID,
        firstName: 'Bob',
        lastName: 'Smith',
        address: '456 Market St',
        city: 'Melbourne',
        state: 'VIC',
        postalCode: '3000',
        phone: '0423456789',
        countryCode: 'AU'
      }
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

    // Technician User + Profile
    const techUser = await User.create({
      username: 'janeTech',
      email: 'jane@tech.com',
      password: await bcrypt.hash('tech12345', 10),
      role: 'technician'
    });
    const tech = await Technician.create({
      userID: techUser.userID,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '0434567890'
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
      productCode: products[0].productCode
    });

    console.log(" Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(" Error seeding data:", error);
    process.exit(1);
  }
};

seed();

# SportsPro

The SportsPro Technical Support application is designed for the technical support department of a sports software company.The system tracks technical support incidents and manages information about customers,products, and technicians.

# Project Structure
### This project is structured to support containerized full-stack development using:

- Node.js + Express for the backend (API).  

* PostgreSQL for the database.  

+ Docker Compose to run everything together.  

- Nginx to handle HTTPS and to balance requests between servers.  

* A client folder to serve frontend files.  

# Setup and Installation Structure  

+ Clone the repository

      https://github.com/ShristiPoudel/sportspro.git

+ Prepare Environment Variables .env inside the server folder

Example:

         DB_NAME=your_database_name 

         DB_USERNAME=your_db_username 
         
         DB_PASSWORD=your_db_password 
         
         DB_HOST=your_db_host 
         
         DB_PORT=your_db_port 
         
         PORT=your_backend_port

+ Ensure Docker and Docker Compose are Installed If not installed, install Docker Desktop for your OS.

+ Build and run containers

      docker compose up --build  

+ Access the application client:
  
  Open https://localhost:8443 in your browser.  

  API: Accessible under the /api/ prefix,e.g., https://localhost:8443/api/products  

  Postgres DB: Accessible using pgAdmin



+ If you want to run the server outside Docker for development

  i. Navigate into the server - 
          
      cd server   
          
  ii. Install dependencies - 
     
      yarn install or npm install   

          
  iii. Run the server with auto-reload- 
 
      yarn start or npm start  
          

+ if you want to stop running containers

      docker-compose down  
      docker-compose down -v 
      ## to stop and remove all containers,networks and volumes

## Testing the application
API are tested using thunder client.

## API DOCUMENTATION
BASE URL: https://localhost:8443/api

| ENDPOINT                         | METHOD | DESCRIPTION                                   |
|----------------------------------|-------|------------------------------------------------|
| /api/products                    | GET    | Retrieve a list of all products               |
| /api/products/add                 | GET    | Add a new product|
| /api/products/:productCode        | POST   | Create a new product with specific product code    |                   
| /api/products/update/:productCode | PUT    | Update an existing product by product code|
| /api/products/delete/:productCode | DELETE | Delete a product using its product code|
| /api/countries                    | POST   | Create and add new country|
| /api/countries/add                | GET    | Fetch all country from database| 
| /api/technicians                  | GET    | Get list of all technicians|
| /api/technicians/add              | POST   | Add a new technician|
| /api/technicians/:techID          | GET    | Get details of a technician by ID|
| /api/technicians/update/:techID   | PUT    | Update technician details by ID|
| /api/technicians/delete/:techID   | DElETE | Delete a technician by ID|
| /api/incidents                    | GET    | Get a list of all reported incidents|
| /api/incidents/:id	              | GET    | Get incidents details by its ID|
| /api/incidents                    | POST   | Report a new incident|
| /api/incidents/:id/assign         | PUT    | Assign a technician to an incident|
| /api/incidents/:id                | PUT    | Update details of a specific incident by its ID|
| /api/customers                    | GET    | Get all customers|
| /api/customers/add                | POST   | Register a new customer|
| /api/customers/:customerID        | GET    | Get customer details by customer ID|
| /api/customers/update/:customerID | PUT    | Update customer information by customer ID|
| /api/customers/search/lastName    | GET    | Search customers by their last name|
| /api/customers/delete/:customerID | DELETE | Delete a customer by ID|
| /api/customers/login              | POST   | Authenticate customer and log in|
| /api/registrations/:customerId    | GET    | Get all registrations for a specific customer|
| /api/registrations                | POST   | Register a customer for a product|


## Assumptions Made
- Docker and Docker Compose are installed locally.  
* postgreSQl version 14 is used  
+ Self-signed SSL certificates are used for HTTPS (for local testing only).
- Ports (8080, 8443, 5433, 3001-3003) are used.    
* The frontend build is placed in client/ and served by Nginx.  
+ The PostgreSQL database is shared by all backend containers.  
- Three backend servers are identical and stateless for load balancing.  
* Environment variables are managed using .env.  
+ The db_data/ folder persists database data across restarts.  
# SportsPro

The SportsPro Technical Support application is designed for the technical support department of a sports software company.The system tracks technical support incidents and manages information about customers,products, and technicians.

# Project Structure
### This project is structured to support containerized full-stack development using:

- Node.js + Express for the backend (API).  

* PostgreSQL for the database.

- JWT (JSON Web Tokens) – Used for secure, stateless authentication and authorization  

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
         
         JWT_SECRET=your_jwt_secret
         
         JWT_REFRESH_SECRET=your_refresh_jwt_secret
         
         ACCESS_TOKEN_EXPIRY=15m
         
         REFRESH_TOKEN_EXPIRY=7d

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

## AUTHENTICATION SYSTEM
We use JWT (JSON Web Token) for secure, stateless user authentication. The flow is:

### Register (POST /register)  
   - User sends username, email, password, role.
   - Server saves username, email, hashed password, role and returns success message.

### Login (POST /login)
   - User sends email & password.
   - Server verifies and returns:  
       - accessToken (short-lived JWT)  
       - refreshToken (long-lived)

### Access Protected Routes
   - Client sends:  
       - Authorization: Bearer `<accessToken>`  
       - Server verifies token and allows access.

### Token Expiry & Refresh (POST /refresh-token)  
   - If access token is expired:  
       - Client sends refreshToken  
       - Server validates and issues new accessToken
### Logout (POST /logout)  
   - Client sends refreshToken
   - Server deletes the refresh token



## API DOCUMENTATION
BASE URL: https://localhost:8443/api

| ENDPOINT                         | METHOD| REQUIRED ROLE | DESCRIPTION                                    |
|----------------------------------|-------|---------------|------------------------------------------------|
| /api/products                    | GET    | Any Authenticate    | Retrieve a list of all products               |
| /api/products/add                 | GET    | Admin              |Add a new product|
| /api/products/:productCode        | POST | Any Authenticate    | Create a new product with specific product code|
| /api/profile                      | GET    | Any Authenticate   |Get profile of user |      
| /api/profile                      | PUT    | Any Authenticate   |Update own profile |      
| /api/products/update/:productCode | PUT    | Admin              |Update an existing product by product code|
| /api/products/delete/:productCode | DELETE | Admin              |Delete a product using its product code|
| /api/countries                    | POST   | Any Authenticate   |Create and add new country|
| /api/countries/add                | GET    | Admin              |Fetch all country from database| 
| /api/technicians                  | GET    | Admin              |Get list of all technicians|
| /api/technicians/me               | GET    | Technician & Admin |Get logged-in technician's profile|
| /api/technicians/add              | POST   | Technician & Admin |Add a new technician|
| /api/technicians/addbyadmin       | POST   | Admin              |Register a new technician by Admin|
| /api/technicians/:techID          | GET    | Technician & Admin |Get details of a technician by ID|
| /api/technicians/update/:techID   | PUT    | Technician & Admin |Update technician details by ID|
| /api/technicians/delete/:techID   | DElETE | Admin              |Delete a technician by ID|
| /api/incidents                    | GET    | Technician & Admin |Get a list of all reported incidents|
| /api/incidents/assigned           | GET    | Technician         |Get a list of technician's assigned incidents|
| /api/incidents/:id	            | GET    | Technician & Admin |Get incidents details by its ID|
| /api/incidents                    | POST   | Customer           |Report a new incident|
| /api/incidents/:id/assign         | PUT    | Admin              |Assign a technician to an incident|
| /api/incidents/:id                | PUT    | Technician & Admin |Update details of a specific incident by its ID|
| /api/customers                    | GET    | Admin              |Get all customers|
| /api/customers/me                 | GET    | Customer & Admin   |Get logged-in customer's profile|
| /api/customers/add                | POST   | Customer & Admin   |Register a new customer|
| /api/customers/addbyadmin         | POST   | Admin              |Register a new customer by Admin|
| /api/customers/:customerID        | GET    | Customer & Admin   |Get customer details by customer ID|
| /api/customers/update/:customerID | PUT    | Customer & Admin   |Update customer information by customer ID|
| /api/customers/search/lastName    | GET    | Admin              |Search customers by their last name|
| /api/customers/delete/:customerID | DELETE | Admin              |Delete a customer by ID|
| /api/auth/register                | POST   | Any                |Register user|
| /api/auth/login                   | POST   | Any                |Login user|
| /api/auth/refresh                 | POST   | Any                |Refresh the access token of user|
| /api/auth/logout                  | POST   | Any                |Logout user |
| /api/registrations/:customerId    | GET    | Customer & Admin   |Get all registrations for a specific customer|
| /api/registrations                | POST   | Customer & Admin   |Register a customer for a product|

## USER ROLES AND USAGE EXAMPLE

This app supports multiple user roles, each with specific permissions and capabilities:

###  Admin
- Full control over users, incidents, products and registrations.
- Can assign technicians, register customers or technicians on behalf and manage all data.

**Example: Create New Product**
```http
POST /api/products
Headers:
  Authorization: Bearer <accessToken>
Body:
{
  "productCode": "P300",
  "name": "SportsPro Firewall",
  "version": 1.0,
  "releaseDate": "2025-01-01"
}
```

---

###  Customer
- Can view & update their profile
- Register products, report incidents and view their own data.

**Example: Report an Incident**
```http
POST /api/incidents
Headers:
  Authorization: Bearer <accessToken>
Body:
{
  "title": "VPN not connecting",
  "description": "Connection drops frequently",
  "productCode": "P200",
  "dateOpened": "2025-07-29T10:30:00Z" // optional

}
```

---

###  Technician
- Views assigned incidents
- Updates incident status

**Example: Update Incident**
```http
PUT /api/incidents/5
Headers:
  Authorization: Bearer <accessToken>
Body:
{
  "description": "Replaced faulty VPN configuration and rebooted system.",
  "dateClosed": "2025-07-29T10:30:00Z" // Optional
}
```

---

## Testing the application
All APIs have been validated with Thunder Client (VS Code extension).

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
import express from "express";
import  "dotenv/config";
import cors from "cors";
import connection from "./config/connection.js";

import productRoute from "./routes/productRoute.js";
import technicianRoute from "./routes/technicianRoute.js";
import customerRoute from "./routes/customerRoute.js";
import registrationRoute from "./routes/registrationRoute.js";
import incidentRoute from './routes/incidentRoute.js';
import countryRoute from "./routes/countryRoute.js";
import authRoutes from "./routes/authRoutes.js"
import userRoute from "./routes/userRoute.js"
import profileRoute from "./routes/profileRoute.js";

const app = express();
const port = process.env.PORT || 8001;

const serverId = process.env.SERVER_ID || "unknown-backend";

// Add X-Server-ID header to all responses
app.use((req, res, next) => {
    res.setHeader('X-Server-ID', serverId);
    next();
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(cors());


//routes
app.use("/api/products", productRoute);
app.use("/api/technicians", technicianRoute);
app.use("/api/customers", customerRoute);
app.use('/api/registrations', registrationRoute);
app.use('/api/incidents', incidentRoute);
app.use('/api/countries', countryRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoute)
app.use("/api/profile", profileRoute);


app.get("/",(req,res)=>{
    res.send("Backend is working");
})


app.listen(port, async()=>{
    console.log(`Server has started on ${port}`);

    try{
        await connection.authenticate();
        connection.sync({ alter: true });
        console.log(" Sucessfully connected to database")
    }
    catch(err){
        console.error("Error during connection to database",err)
    }
});
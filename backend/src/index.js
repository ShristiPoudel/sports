import express from "express"
import  "dotenv/config";
import cors from "cors";
import connection from "./config/connection.js";

const app = express();
const port = process.env.PORT || 8001;

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(cors());

//routes

//testing routes
app.get("/",(req,res)=>{
    res.send("Backend is working");
})


app.listen(port, async()=>{
    console.log(`Server has started on ${port}`);

    try{
        await connection.authenticate();
        connection.sync();
        console.log(" Sucessfully connected to database")
    }
    catch(err){
        console.error("Error during connection to database",err)
    }
});
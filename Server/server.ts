import {app} from "./app";
require("dotenv").config();
import connectDB from "./Utils/db";
import {v2 as cloudinary} from "cloudinary";


cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_API_KEY,
 api_secret: process.env.CLOUD_SECRET_KEY,
});


// Create server
app.listen(process.env.PORT, ()=>{
    console.log(`Server is connected with port ${process.env.PORT}`)
    connectDB()
});

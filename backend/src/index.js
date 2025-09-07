import express  from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import friendsRoutes from "./routes/friends.route.js"  // ADD THIS LINE
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path";

import {ConnectDB} from "./lib/db.js"
import { app , server } from "./lib/socket.js";

dotenv.config() //to get access to the environment variable from .env file
// const app = express(); // now at the end while implimenting socket.io for realitime communication ,we dont need this app because we did created one in the socket.js file

const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser()) // it just simply allows us to parse the cookies
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/friends", friendsRoutes)  

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
    })
}


//not now app.listen , its the server now , we will directly communicate with server
server.listen(PORT, ()=>{
    console.log("Server is running on port " , PORT);
    ConnectDB();
})
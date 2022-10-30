import { Server } from "http";
import { Express } from "express";
import dotenv from "dotenv";
const StartServer = require("./server");

StartServer().then((app: Express) => {

    dotenv.config();
    const port = process.env.EXPRESS_PORT;
    
    const server: Server = app.listen(port, () => {
    //console.log("Server is running on port " + port);
    });  
});

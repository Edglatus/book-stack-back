import { Server } from "http";
import { Express } from "express";
import dotenv from "dotenv";
import StartServer from "./server";

StartServer().then((app: Express) => {

    dotenv.config();
    const port = process.env.EXPRESS_PORT;
    
    app.listen(port, () => {
        console.log("Listening on port " + port);
    });
});

import { Server } from "http";
import { Express } from "express";
import dotenv from "dotenv";
import ConfigureServer from "./config";


module.exports = async () => {
  dotenv.config();
  
  const app: Express = await ConfigureServer();
  const port = process.env.EXPRESS_PORT;
  
  const server: Server = app.listen(port, () => {
    console.log("Server is running on port " + port);
  });  

  return { app, server };
}


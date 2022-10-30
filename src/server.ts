import { Server } from "http";
import { Express } from "express";
import dotenv from "dotenv";
import ConfigureServer, { ServerType } from "./config";


module.exports = async (serverType: ServerType = ServerType.Remote) => {
  
  const app: Express = await ConfigureServer(serverType);

  return { app };
}


import { Server } from "http";
import { Express } from "express";
import dotenv from "dotenv";
import ConfigureServer, { ServerType } from "./config";


export default async (serverType: ServerType = ServerType.Remote): Promise<Express> => {
  
  const app: Express = await ConfigureServer(serverType);

  return app;
}


import express, { Express } from "express";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const server: Express = express();
const port = process.env.PORT;

server.use(cors());
server.listen(port, () => {
  console.log('Server is running');
});

module.exports = server;
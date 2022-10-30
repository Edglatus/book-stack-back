import express, { Express } from "express";
import iAdapter from "./adapter/adapter";
import ConnectToDatabase from "./adapter/mongo/connection";
import GenericAdapterMongo from "./adapter/mongo/generic";
import AuthorMongoModel from "./adapter/mongo/model/author";
import BookMongoModel from "./adapter/mongo/model/book";
import UserMongo from "./adapter/mongo/model/user";
import UserAdapterMongo from "./adapter/mongo/user";
import { AuthenticationController } from "./controller/authentication";
import { GenericController } from "./controller/controller";
import { iAuthor } from "./model/author";
import { iBook } from "./model/book";
import { iUser } from "./model/user";
import AuthenticationRouter from "./routes/authenticationRouter";
import GenericRouter from "./routes/genericRouter";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { Connection } from "mongoose";

let connection: Connection;

export default async function ConfigureServer(): Promise<Express> {
    let server: Express = express();
    server.use(cors());
    server.use(bodyParser.json());
    server = await SetConfiguration(server);

    return server;
}


async function SetConfiguration(server: Express): Promise<Express> {
    return await ConfigureMongoServer(server);
}

async function ConfigureMongoServer(server: Express): Promise<Express> {
    const config = dotenv.config();
    
    if(!config.parsed)
        throw Error("Config Error!");

    //dotenv
    const URI = config.parsed.MONGO_URI;
    const uName = config.parsed.MONGO_UNAME;
    const pwd = config.parsed.MONGO_PWD;

    //Start Connection
    connection = await ConnectToDatabase(URI, uName, pwd);

    //Models
    const userModel = new UserMongo();
    const authorModel = new AuthorMongoModel();
    const bookModel = new BookMongoModel();

    //Adapters
    const userAdapter = new UserAdapterMongo(userModel);
    const authorAdapter = new GenericAdapterMongo<iAuthor>(authorModel);
    const bookAdapter = new GenericAdapterMongo<iBook>(bookModel);

    //Controllers
    const userController = new GenericController<iUser>();
    const authorController = new GenericController<iAuthor>();
    const bookController = new GenericController<iBook>();
    const authenticationController = new AuthenticationController();

    //Routers
    const userRouter = GenericRouter.CreateRoutes(userController, userAdapter);
    const authorRouter = GenericRouter.CreateRoutes(authorController, authorAdapter);
    const bookRouter = GenericRouter.CreateRoutes(bookController, bookAdapter);
    const authenticationRouter = AuthenticationRouter.CreateRoutes(authenticationController, userAdapter);

    //Use Routes
    server.use("/user", userRouter);
    server.use("/author", authorRouter);
    server.use("/book", bookRouter);
    server.use("/auth", authenticationRouter);

    return server;
}

export async function ShutdownMongo() {
    await connection.dropDatabase();
    await connection.close();
}
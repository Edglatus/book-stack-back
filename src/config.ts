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

export enum ServerType {
    Local,
    Test,
    Remote
}

export default async function ConfigureServer(serverType: ServerType = ServerType.Remote): Promise<Express> {
    let server: Express = express();
    server.use(cors());
    server.use(bodyParser.json());
    server = await SetConfiguration(server, serverType);

    return server;
}


async function SetConfiguration(server: Express, serverType: ServerType): Promise<Express> {
    return await ConfigureMongoServer(server, serverType);
}

async function ConfigureMongoServer(server: Express, serverType: ServerType): Promise<Express> {
    //console.log(serverType);
    const config = dotenv.config();
    
    if(!config.parsed)
        throw Error("Config Error!");

    //dotenv

    const URI = (serverType == ServerType.Remote) ? 
        config.parsed.MONGO_REMOTE_URI : (serverType == ServerType.Local) ? 
            config.parsed.MONGO_LOCAL_URI : config.parsed.MONGO_TEST_URI;
    const uName = (serverType == ServerType.Remote) ? 
        config.parsed.MONGO_REMOTE_UNAME : (serverType == ServerType.Local) ? 
            config.parsed.MONGO_LOCAL_UNAME : config.parsed.MONGO_TEST_UNAME;
    const pwd = (serverType == ServerType.Remote) ? 
        config.parsed.MONGO_REMOTE_PWD : (serverType == ServerType.Local) ? 
            config.parsed.MONGO_LOCAL_PWD : config.parsed.MONGO_TEST_PWD;


    //console.log(URI + '\n' + uName + '\n' + pwd)
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
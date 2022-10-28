import express, { Express } from "express";
import UserAdapterInMemory from "../../../src/adapter/inMemory/user";
import iAuthenticationController, { AuthenticationController } from "../../../src/controller/authentication";
import AuthenticationRouter from "../../../src/routes/authenticationRouter";
import request from "supertest";

describe("Setter Routes", () => {
    let controller: iAuthenticationController = {
        Authenticate: jest.fn().mockImplementation(async (req, res) => res.status(200).json())
    };

    const server: Express = express();
    
    server.use("/auth", AuthenticationRouter.CreateRoutes(controller, jest.mocked(new UserAdapterInMemory())))

    it("Should Call authenticator Routes", async () => {
        await request(server).post('/auth');
        
        expect(controller.Authenticate).toHaveBeenCalled();
    });
});
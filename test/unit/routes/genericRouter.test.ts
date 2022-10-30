import express, { Express, response } from "express";
import UserAdapterInMemory from "../../../src/adapter/inMemory/user";
import iController from "../../../src/controller/controller";
import { iUser } from "../../../src/model/user";
import GenericRouter from "../../../src/routes/genericRouter";
import request from 'supertest';
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import mockHttp from "node-mocks-http";


describe("Generic Router", () => {
    let controller: iController<iUser> = {
        GetOne: jest.fn().mockImplementation(async (req, res) => res.status(200).json()),
        GetAll: jest.fn().mockImplementation(async (req, res) => res.status(200).json()),
        Create: jest.fn().mockImplementation(async (req, res) => res.status(200).json()),
        Update: jest.fn().mockImplementation(async (req, res) => res.status(200).json()),
        Delete: jest.fn().mockImplementation(async (req, res) => res.status(200).json())
    };
       
    const server: Express = express();
    
    server.use("/user", GenericRouter.CreateRoutes(controller, jest.mocked(new UserAdapterInMemory())))
    
    it("Should Call getter Routes", async () => {
        await request(server).get('/user');
        await request(server).get('/user/1');
        
        expect(controller.GetAll).toHaveBeenCalled();
        expect(controller.GetOne).toHaveBeenCalled();
    });

    it("Should Call setter Routes", async () => {
        await request(server).post('/user');
        
        expect(controller.Create).toHaveBeenCalled();
    });

    it("Should Call update Routes", async () => {
        await request(server).put('/user/1');
        
        expect(controller.Update).toHaveBeenCalled();
    });

    it("Should Call delete Routes", async () => {
        await request(server).delete('/user/1');
        
        expect(controller.Delete).toHaveBeenCalled();
    });
});
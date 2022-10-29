import express, { Express, response } from "express";
import UserAdapterInMemory from "../../src/adapter/inMemory/user";
import iController, { GenericController } from "../../src/controller/controller";
import { iUser } from "../../src/model/user";
import GenericRouter from "../../src/routes/genericRouter";
import request from 'supertest';
import httpMocks from 'node-mocks-http'
import body_parser from 'body-parser' ;
import AuthenticationRouter from "../../src/routes/authenticationRouter";
import iAuthenticationController, { AuthenticationController } from "../../src/controller/authentication";


describe("Generic Router", () => {
    let adapter = new UserAdapterInMemory();
    let controller: GenericController<iUser> = new GenericController<iUser>();
       
    let server: Express;
    
    const newUser_a: iUser = {email: "Eddy", password: "123Batata"};
    const newUser_b: iUser = {email: "Josué", password: "123Batata"};
    const user_a_clone: iUser = {email: "Eddy", password: "66613"};

    beforeEach(() => {
        adapter = new UserAdapterInMemory();
        controller = new GenericController<iUser>();
        
        server = express();
        server.use(body_parser.json());
        server.use("/user", GenericRouter.CreateRoutes(controller, adapter));
    });
    
    describe("Getter Routes", () => {
        it("Should return an empty list on no entities", async () => {
            const response = await request(server).get('/user');
            
            expect(response.statusCode).toBe(200);
            expect(response.body.data.length).toBe(0);
        });

        it("Should return 404 on nonexistent entity", async () => {
            const response = await request(server).get('/user/1');
            
            expect(response.statusCode).toBe(404);
            expect(response.body.data).toBe(undefined);
        });

    });

    describe("Setter Routes", () => {

        beforeEach(() => {
            controller = new GenericController<iUser>();
        });

        it("Should properly create an entity", async() => {
            const response = await request(server).post("/user").send(newUser_a);
            const data = response.body.data;

            expect(response.status).toBe(200);
            expect(data).toBeDefined();

            const getResponse = await request(server).get("/user/" + data.id);
            const getData = getResponse.body.data;

            expect(getResponse.status).toBe(200);
            expect(getData).toBeDefined();

            expect(getData).toEqual({id: data.id, ...newUser_a});
        });

        it("Should not allow double creation of entities", async() => {
            const response = await request(server).post("/user").send(newUser_a);
            const data = response.body.data;

            expect(response.status).toBe(200);
            expect(data).toBeDefined();

            const invalidResponse = await request(server).post("/user").send(newUser_a);
            const invalidData = invalidResponse.body.data;

            expect(invalidResponse.status).toBe(409);
            expect(invalidData).not.toBeDefined();
        });

        it("Should properly add multiple different entities", async() => {
            const response_a = await request(server).post("/user").send(newUser_a);
            const data_a = response_a.body.data;

            expect(response_a.status).toBe(200);
            expect(data_a).toBeDefined();

            const response_b = await request(server).post("/user").send(newUser_b);
            const data_b = response_b.body.data;

            expect(response_b.status).toBe(200);
            expect(data_b).toBeDefined();
        });

        it("Should return 500 on undefined request body", async() => {
            const response_a = await request(server).post("/user").send();
            const data_a = response_a.body.data;

            expect(response_a.status).toBe(500);
            expect(data_a).not.toBeDefined();
        });
    });

    describe("Update Routes", () => {
        let id: string;
        
        beforeEach(async () => {
            controller = new GenericController<iUser>();
    
            const res = await request(server).post("/user").send(newUser_a);
            id = res.body.data.id;
        });
        
        it("Should properly update an existing entity", async() => {
            const response = await request(server).put("/user/" + id).send(user_a_clone);
            const success = response.body.success;

            expect(response.status).toBe(200);
            expect(success).toBeDefined();
            expect(success).toBe(true);

            const getResponse = await request(server).get("/user/" + id);
            const getData = getResponse.body.data;

            expect(getResponse.status).toBe(200);
            expect(getData).toBeDefined();

            expect(getData).toEqual({id, ...user_a_clone});
        });
    
        it("Should not allow edition of an inexistent entity", async() => {
            const response = await request(server).put("/user/" + "-5").send(user_a_clone);
            const success = response.body.success;

            expect(response.status).toBe(404);
            expect(success).toBeDefined();
            expect(success).toBe(false);
        });
    
        it("Should return 500 on undefined body", async() => {
            const response = await request(server).put("/user/" + "-5");
            const data = response.body.success;

            expect(response.status).toBe(500);
            expect(data).not.toBeDefined();
        });
    });

    describe("Delete Routes", () => {
        let id: string;
        
        beforeEach(async () => {
            controller = new GenericController<iUser>();
    
            const res = await request(server).post("/user").send(newUser_a);
            id = res.body.data.id;
        });
        
        it("Should properly delete an existing entity", async() => {
            const response = await request(server).delete("/user/" + id);
            const success = response.body.success;

            expect(response.status).toBe(200);
            expect(success).toBeDefined();
            expect(success).toBe(true);

            const getResponse = await request(server).get("/user/" + id);
            const getData = getResponse.body.data;

            expect(getResponse.status).toBe(404);
            expect(getData).not.toBeDefined();
        });
    
        it("Should not allow deletion of an inexistent entity", async() => {
            const response = await request(server).delete("/user/" + "-5");
            const success = response.body.success;

            expect(response.status).toBe(404);
            expect(success).toBeDefined();
            expect(success).toBe(false);
        });
    });
});

describe("Authentication Router", () => {
    const newUser_a: iUser = {email: "Eddy", password: "123Batata"};
    const server: Express = express();
    let id: string;

    beforeAll(async () => {
        const adapter = new UserAdapterInMemory();
        const controller: iAuthenticationController = new AuthenticationController();
        
        id = await adapter.Create(newUser_a);
        
        server.use(body_parser.json());
        server.use("/auth", AuthenticationRouter.CreateRoutes(controller, adapter));
    });

    it("Should properly Authenticate on valid user data", async() => {
        const response = await request(server).post("/auth").send(newUser_a);
        const data = response.body.data;
        const success = response.body.success;

        expect(response.status).toBe(202);
        expect(data).toBeDefined();
        expect(success).toBeDefined();
        
        expect(data).toEqual({id, ...newUser_a});
        expect(success).toBe(true);
    });

    it("Should reject an invalid user", async() => {
        const response = await request(server).post("/auth").send({username: "Edglatus", password: "123Batata"});
        const data = response.body.data;
        const success = response.body.success;

        expect(response.status).toBe(403);
        expect(data).not.toBeDefined();
        expect(success).toBeDefined();
        
        expect(success).toBe(false);
    });

    it("Should reject on invalid password", async() => {
        const response = await request(server).post("/auth").send({username: "Eddy", password: "123batata"});
        const data = response.body.data;
        const success = response.body.success;

        expect(response.status).toBe(403);
        expect(data).not.toBeDefined();
        expect(success).toBeDefined();
        
        expect(success).toBe(false);
    });
});
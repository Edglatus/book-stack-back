import { Server } from "http";
import { Express } from "express";
import iDomainObject from "../../src/model/domainObject";
import { ServerType, ShutdownMongo } from "../../src/config";
import request from "supertest";
import StartServer from "../../src/server";

export default function TestSystemRouting<T extends iDomainObject>(
    message: string, route: string, createdObj_a: T, createdObj_b: T, updatedObj: T, serverType: ServerType
) {
    
    let app: Express;

    let id_a: string;

    describe(message, () => {

        beforeAll(async () => {
            app = await StartServer(serverType);
        });
        afterAll(async () => {
            await ShutdownMongo();
        });
        
        describe("Getter Routes", () => {
            it("Should return an empty list on no entities", async () => {
                const response = await request(app).get(route);
                
                expect(response.statusCode).toBe(200);
                expect(response.body.data.length).toBe(0);
            });

            it("Should return 404 on nonexistent entity", async () => {
                const response = await request(app).get(route + "/1");
                
                expect(response.statusCode).toBe(404);
                expect(response.body.data).toBe(undefined);
            });

        });

        describe("Setter Routes", () => {

            it("Should properly create an entity", async() => {
                const response = await request(app).post(route).send(createdObj_a);
                const data = response.body.data;

                expect(response.status).toBe(200);
                expect(data).toBeDefined();

                id_a = data.id;

                const getResponse = await request(app).get(route + "/" + id_a);
                const getData = getResponse.body.data;

                expect(getResponse.status).toBe(200);
                expect(getData).toBeDefined();

                const expected = JSON.parse(JSON.stringify({id: id_a,  ...createdObj_a}));
                
                expect(getData).toMatchObject(expected);
            });

            it("Should not allow double creation of entities", async() => {
                const invalidResponse = await request(app).post(route).send(createdObj_a);
                const invalidData = invalidResponse.body.data;

                expect(invalidResponse.status).toBe(409);
                expect(invalidData).not.toBeDefined();
            });

            it("Should properly add multiple different entities", async() => {
                const response_b = await request(app).post(route).send(createdObj_b);
                const data_b = response_b.body.data;

                expect(response_b.status).toBe(200);
                expect(data_b).toBeDefined();
            });

            it("Should return 500 on undefined request body", async() => {
                const response_a = await request(app).post(route).send();
                const data_a = response_a.body.data;

                expect(response_a.status).toBe(500);
                expect(data_a).not.toBeDefined();
            });
        });

        describe("Update Routes", () => {
            
            it("Should properly update an existing entity", async() => {
                const response = await request(app).put(route + "/" + id_a).send(updatedObj);
                const success = response.body.success;

                expect(response.status).toBe(200);
                expect(success).toBeDefined();
                expect(success).toBe(true);

                const getResponse = await request(app).get(route + "/" + id_a);
                const getData = getResponse.body.data;

                expect(getResponse.status).toBe(200);
                expect(getData).toBeDefined();

                const expected = JSON.parse(JSON.stringify({id: id_a,  ...updatedObj}))

                expect(getData).toMatchObject(expected);
            });
        
            it("Should not allow edition of an inexistent entity", async() => {
                const response = await request(app).put(route + "/" + "-5").send(updatedObj);
                const success = response.body.success;

                expect(response.status).toBe(404);
                expect(success).toBeDefined();
                expect(success).toBe(false);
            });
        
            it("Should return 500 on undefined body", async() => {
                const response = await request(app).put(route + "/" + "-5");
                const data = response.body.success;

                expect(response.status).toBe(500);
                expect(data).not.toBeDefined();
            });
        });

        describe("Delete Routes", () => {        
            it("Should properly delete an existing entity", async() => {
                const response = await request(app).delete(route + "/" + id_a);
                const success = response.body.success;

                expect(response.status).toBe(200);
                expect(success).toBeDefined();
                expect(success).toBe(true);

                const getResponse = await request(app).get(route + "/" + id_a);
                const getData = getResponse.body.data;

                expect(getResponse.status).toBe(404);
                expect(getData).not.toBeDefined();
            });
        
            it("Should not allow deletion of an inexistent entity", async() => {
                const response = await request(app).delete(route + "/" + "-5");
                const success = response.body.success;

                expect(response.status).toBe(404);
                expect(success).toBeDefined();
                expect(success).toBe(false);
            });
        });
    });
}
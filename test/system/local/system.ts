import { Express } from "express";
import { iUser } from "../../../src/model/user";
import request from 'supertest';
import { Server } from "http";
import { ServerType, ShutdownMongo } from "../../../src/config";
import TestSystemRouting from "../generic";
import { iAuthor } from "../../../src/model/author";
import { iBook } from "../../../src/model/book";
import StartServer from "../../../src/server";


export default function SetupSystemTests(message: string, serverType: ServerType) {

    describe(message + " System Test", () => {
    
        // //User
        const newUser_a: iUser = {email: "Eddy", password: "123Batata"};
        const newUser_b: iUser = {email: "Josué", password: "123Batata"};
        const updatedUser: iUser = {email: "Eddy", password: "66613"};

        TestSystemRouting<iUser>("User Routes", "/user", newUser_a, newUser_b, updatedUser, serverType);

        // //Author
        const newAuthor_a: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 23)};
        const newAuthor_b: iAuthor = {name: "Josué", birth_date: new Date(1973, 4, 28)};
        const updatedAuthor: iAuthor = {name: "Edglatus", birth_date: new Date(1996, 8, 23)};

        TestSystemRouting<iAuthor>("Author Routes", "/author", newAuthor_a, newAuthor_b, updatedAuthor, serverType);

        //Book
        const newBook_a: iBook = { 
            title: "Name of the Wind", isbn: "9780756404079", author_id: "978075640407978075640407",
            cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
        };
        const newBook_b: iBook = { 
            title: "Wise Man\'s Fear", isbn: "9781473214644", author_id: "978075640407978075640407",
            cover_url: "https://m.media-amazon.com/images/I/81NX-69L22L.jpg", publishing_date: new Date(2011, 3, 1)
        };
        const updatedBook: iBook = { 
            title: "Name of the Wind, The", isbn: "9780756404079", author_id: "978075640407978075640407",
            cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
        };
        
        TestSystemRouting<iBook>("Book Routes", "/book", newBook_a, newBook_b, updatedBook, serverType);
    });


    describe(message + "Authentication Router", () => {

        let app: Express;

        const newUser_b: iUser = {email: "Josué", password: "123Batata"};
        let id_b: string;


        beforeAll(async () => {
            app = await StartServer(serverType);

            const response_b = await request(app).post("/user").send(newUser_b);
            id_b = response_b.body.data.id;
        });
        afterAll(async () => {
            await ShutdownMongo();
        });

        it("Should properly Authenticate on valid user data", async() => {
            const response = await request(app).post("/auth").send(newUser_b);
            const data = response.body.data;
            const success = response.body.success;

            expect(response.status).toBe(202);
            expect(data).toBeDefined();
            expect(success).toBeDefined();
            
            expect(data).toMatchObject({id: id_b, ...newUser_b});
            expect(success).toBe(true);
        });

        it("Should reject an invalid user", async() => {
            const response = await request(app).post("/auth").send({email: newUser_b.email + "123", password: newUser_b.password});
            const data = response.body.data;
            const success = response.body.success;

            expect(response.status).toBe(403);
            expect(data).not.toBeDefined();
            expect(success).toBeDefined();
            
            expect(success).toBe(false);
        });

        it("Should reject on invalid password", async() => {
            const response = await request(app).post("/auth").send({email: newUser_b.email, password: newUser_b.password + "123"});
            const data = response.body.data;
            const success = response.body.success;

            expect(response.status).toBe(403);
            expect(data).not.toBeDefined();
            expect(success).toBeDefined();
            
            expect(success).toBe(false);
        });
});
}

import ConnectToDatabase from "../../../../src/adapter/mongo/connection";
import GenericAdapterMongo from "../../../../src/adapter/mongo/generic";
import UserMongoModel from "../../../../src/adapter/mongo/model/user";
import { iUser, User } from "../../../../src/model/user";
import TestAdapter from "../generic";
import { Connection } from "mongoose";
import { iAuthor } from "../../../../src/model/author";
import { iBook } from "../../../../src/model/book";
import AuthorMongoModel from "../../../../src/adapter/mongo/model/author";
import BookMongoModel from "../../../../src/adapter/mongo/model/book";
import UserAdapterMongo from "../../../../src/adapter/mongo/user";

describe("Mongoose Adapter", () => {
    let connection: Connection;

    beforeAll(async () => {
        connection = await ConnectToDatabase("mongodb://mongo:27017/test", "admin", "admin");
    });
    afterAll(async () => {        
        await connection.dropDatabase();
        await connection.close();
    });

    describe("User Adapter", () => {
        const newUser_a: iUser = {email: "Eddy@mail.com", password: "123Batata$"};
        const newUser_b: iUser = {email: "Josué@mail.com", password: "123Batata$"};
        const user_a_clone: iUser = {email: "Eddy@mail.com", password: "666Potato$"};
    
        const userModel = new UserMongoModel();
        TestAdapter<iUser>(new UserAdapterMongo(userModel), "User Adapter", newUser_a, newUser_b, user_a_clone, user_a_clone);
    });

    describe("Author Adapter", () => {
        const newAuthor_a: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 23)};
        const newAuthor_b: iAuthor = {name: "Josué", birth_date: new Date(1973, 4, 28)};
        const author_a_clone: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 28)};
        const updatedAuthor: iAuthor = {name: "Edglatus", birth_date: new Date(1996, 8, 23)};
    
        const authorModel = new AuthorMongoModel();
        TestAdapter<iAuthor>(new GenericAdapterMongo<iAuthor>(authorModel), "Author Adapter", newAuthor_a, newAuthor_b, author_a_clone, updatedAuthor);
    });

    describe("Book Adapter", () => {
        const newBook_a: iBook = { 
            title: "Name of the Wind", isbn: "9780756404079", author_id: "0",
            cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
        };
        const newBook_b: iBook = { 
            title: "Wise Man's Fear", isbn: "9781473214644", author_id: "0",
            cover_url: "https://m.media-amazon.com/images/I/81NX-69L22L.jpg", publishing_date: new Date(2011, 3, 1)
        };
        const book_a_clone: iBook = { 
            title: "Name of the Wind, The", isbn: "9780756404079", author_id: "0",
            cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
        };
        
        const bookModel = new BookMongoModel();
        TestAdapter<iBook>(new GenericAdapterMongo<iBook>(bookModel), "Book Adapter", newBook_a, newBook_b, book_a_clone, book_a_clone);
    });
});
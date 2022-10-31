import AuthorAdapterInMemory from "../../../../src/adapter/inMemory/author";
import BookAdapterInMemory from "../../../../src/adapter/inMemory/book";
import UserAdapterInMemory from "../../../../src/adapter/inMemory/user";
import { iAuthor } from "../../../../src/model/author";
import { iBook } from "../../../../src/model/book";
import { iUser } from "../../../../src/model/user";
import TestAdapter from "../generic";


describe("inMemory Adapter Tests", () => {
    
    //User
    const newUser_a: iUser = {email: "Eddy@mail.com", password: "123Batata$"};
    const newUser_b: iUser = {email: "Josué@mail.com", password: "123Batata$"};
    const user_a_clone: iUser = {email: "Eddy@mail.com", password: "666Potato$"};

    TestAdapter<iUser>(new UserAdapterInMemory(), "User Adapter", newUser_a, newUser_b, user_a_clone, user_a_clone);

    //Book
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

    TestAdapter<iBook>(new BookAdapterInMemory(), "Book Adapter", newBook_a, newBook_b, book_a_clone, book_a_clone);

    //Author    
    const newAuthor_a: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 23)};
    const newAuthor_b: iAuthor = {name: "Josué", birth_date: new Date(1973, 4, 28)};
    const author_a_clone: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 28)};
    const updatedAuthor: iAuthor = {name: "Edglatus", birth_date: new Date(1996, 8, 23)};

    TestAdapter<iAuthor>(new AuthorAdapterInMemory(), "Author Adapter", newAuthor_a, newAuthor_b, author_a_clone, updatedAuthor);
})

// describe("Entity Creation", () => {
//     let sut: UserAdapterInMemory;
//     const newUser_a: iUser = {username: "Eddy", password: "123Batata"};
//     const newUser_b: iUser = {username: "Josué", password: "123Batata"};
    
//     beforeEach(() => {
//         sut = new UserAdapterInMemory();
//     });
    
//     it("Should properly create an entity", async() => {
//         let id = await sut.Create(newUser_a);

//         expect(id).toBeDefined();
//         expect(id).not.toBe("");
//         newUser_a.id = id;
        
//         const createdUser = await sut.GetOne(id);

//         expect(createdUser).toBeDefined();
//         expect(createdUser).toEqual(newUser_a);
//     });

//     it("Should not allow double creation of entities", async() => {
//         let id = await sut.Create(newUser_a);

//         expect(id).toBeDefined();
//         expect(id).not.toBe("");

//         id = await sut.Create(newUser_a);

//         expect(id).toBeDefined();
//         expect(id).toBe("");
//     });

//     it("Should properly add multiple different entities", async() => {
//         const id_a = await sut.Create(newUser_a);

//         expect(id_a).toBeDefined();
//         expect(id_a).not.toBe("");
//         newUser_a.id = id_a;
        
//         const id_b = await sut.Create(newUser_b);

//         expect(id_b).toBeDefined();
//         expect(id_b).not.toBe("");
//         newUser_b.id = id_b;
        
//         const userList = await sut.GetAll();

//         expect(userList).toBeDefined();
//         expect(userList).toContainEqual(newUser_a);
//         expect(userList).toContainEqual(newUser_b);
//     });
// });

// describe("Entity Edition", () => {
//     let sut: UserAdapterInMemory;
//     const newUser: iUser = {username: "Eddy", password: "123Batata"};
//     const updatedUser: iUser = {username: "Eddy", password: "66613"};
//     let id: string;
    
//     beforeEach(async () => {
//         sut = new UserAdapterInMemory();
//         id = await sut.Create(newUser);
//     });
    
//     it("Should properly update an existing entity", async() => {
//         expect(await sut.Update(id, updatedUser)).toBe(true);

//         const createdUser = await sut.GetOne(id);

//         expect(createdUser).toBeDefined();
//         expect(createdUser).toEqual(updatedUser);
//     });

//     it("Should not allow edition of an inexistent entity", async() => {
//         expect(await sut.Update("-5", updatedUser)).toBe(false);
//     });
// });

// describe("Entity Deletion", () => {
//     let sut: UserAdapterInMemory;
//     const newUser: iUser = {username: "Eddy", password: "123Batata"};
//     let id: string;
    
//     beforeEach(async () => {
//         sut = new UserAdapterInMemory();
//         id = await sut.Create(newUser);
//     });
    
//     it("Should properly update an existing entity", async() => {
//         expect(await sut.Delete(id)).toBe(true);

//         const deletedUser = await sut.GetOne(id);

//         expect(deletedUser).toBeNull();
//     });

//     it("Should not allow edition of an inexistent entity", async() => {
//         expect(await sut.Delete("-5")).toBe(false);
//     });
// })
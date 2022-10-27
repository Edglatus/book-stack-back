import BookAdapterInMemory from "../../../src/adapter/inMemory/book";
import { iBook } from "../../../src/model/book";

describe("Entity Creation", () => {
    let sut: BookAdapterInMemory;
    const newBook_a: iBook = { 
        title: "Name of the Wind", isbn: "9780756404079", author_id: "0",
        cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
    };
    const newBook_b: iBook = { 
        title: "Wise Man's Fear", isbn: "9781473214644", author_id: "0",
        cover_url: "https://m.media-amazon.com/images/I/81NX-69L22L.jpg", publishing_date: new Date(2011, 3, 1)
    };
    const newBook_c: iBook = { 
        title: "Name of the Wind, The", isbn: "9780756404079", author_id: "0",
        cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
    };
    
    beforeEach(() => {
        sut = new BookAdapterInMemory();
    });
    
    it("Should properly create an entity", async() => {
        let id = await sut.Create(newBook_a);

        expect(id).toBeDefined();
        expect(id).not.toBe("");
        newBook_a.id = id;
        
        const createdBook = await sut.GetOne(id);

        expect(createdBook).toBeDefined();
        expect(createdBook).toEqual(newBook_a);
    });

    it("Should not allow double creation of entities", async() => {
        let id = await sut.Create(newBook_a);

        expect(id).toBeDefined();
        expect(id).not.toBe("");

        id = await sut.Create(newBook_c);

        expect(id).toBeDefined();
        expect(id).toBe("");
    });

    it("Should properly add multiple different entities", async() => {
        const id_a = await sut.Create(newBook_a);

        expect(id_a).toBeDefined();
        expect(id_a).not.toBe("");
        newBook_a.id = id_a;
        
        const id_b = await sut.Create(newBook_b);

        expect(id_b).toBeDefined();
        expect(id_b).not.toBe("");
        newBook_b.id = id_b;
        
        const BookList = await sut.GetAll();

        expect(BookList).toBeDefined();
        expect(BookList).toContainEqual(newBook_a);
        expect(BookList).toContainEqual(newBook_b);
    });
});

describe("Entity Edition", () => {
    let sut: BookAdapterInMemory;
    const newBook: iBook = { 
        title: "Name of the Wind", isbn: "9780756404079", author_id: "0",
        cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
    };
    let id: string;
    
    beforeEach(async () => {
        sut = new BookAdapterInMemory();
        id = await sut.Create(newBook);
    });
    
    it("Should properly update an existing entity", async() => {
        const updatedBook = newBook;
        updatedBook.title += ", The";

        expect(await sut.Update(id, updatedBook)).toBe(true);

        const createdBook = await sut.GetOne(id);

        expect(createdBook).toBeDefined();
        expect(createdBook).toEqual(updatedBook);
    });

    it("Should not allow edition of an inexistent entity", async() => {
        expect(await sut.Update("-5", newBook)).toBe(false);
    });
});

describe("Entity Deletion", () => {
    let sut: BookAdapterInMemory;
    const newBook: iBook = { 
        title: "Name of the Wind", isbn: "9780756404079", author_id: "0",
        cover_url: "https://m.media-amazon.com/images/I/91b8oNwaV1L.jpg", publishing_date: new Date(2007, 3, 27)
    };
    let id: string;
    
    beforeEach(async () => {
        sut = new BookAdapterInMemory();
        id = await sut.Create(newBook);
    });
    
    it("Should properly update an existing entity", async() => {
        expect(await sut.Delete(id)).toBe(true);

        const deletedBook = await sut.GetOne(id);

        expect(deletedBook).toBeNull();
    });

    it("Should not allow edition of an inexistent entity", async() => {
        expect(await sut.Delete("-5")).toBe(false);
    });
})
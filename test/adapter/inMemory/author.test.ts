import AuthorAdapterInMemory from "../../../src/adapter/inMemory/author";
import { iAuthor } from "../../../src/model/author";

describe("Entity Creation", () => {
    let sut: AuthorAdapterInMemory;
    const newAuthor_a: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 23)};
    const newAuthor_b: iAuthor = {name: "Josué", birth_date: new Date(1973, 4, 28)};
    
    beforeEach(() => {
        sut = new AuthorAdapterInMemory();
    });
    
    it("Should properly create an entity", async() => {
        let id = await sut.Create(newAuthor_a);

        expect(id).toBeDefined();
        expect(id).not.toBe("");
        newAuthor_a.id = id;
        
        const createdAuthor = await sut.GetOne(id);

        expect(createdAuthor).toBeDefined();
        expect(createdAuthor).toEqual(newAuthor_a);
    });

    it("Should not allow double creation of entities", async() => {
        let id = await sut.Create(newAuthor_a);

        expect(id).toBeDefined();
        expect(id).not.toBe("");

        id = await sut.Create(newAuthor_a);

        expect(id).toBeDefined();
        expect(id).toBe("");
    });

    it("Should properly add multiple different entities", async() => {
        const id_a = await sut.Create(newAuthor_a);

        expect(id_a).toBeDefined();
        expect(id_a).not.toBe("");
        newAuthor_a.id = id_a;
        
        const id_b = await sut.Create(newAuthor_b);

        expect(id_b).toBeDefined();
        expect(id_b).not.toBe("");
        newAuthor_b.id = id_b;
        
        const AuthorList = await sut.GetAll();

        expect(AuthorList).toBeDefined();
        expect(AuthorList).toContainEqual(newAuthor_a);
        expect(AuthorList).toContainEqual(newAuthor_b);
    });
});

describe("Entity Edition", () => {
    let sut: AuthorAdapterInMemory;
    const newAuthor: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 23)};
    const updatedAuthor: iAuthor = {name: "Edglatus", birth_date: new Date(1996, 8, 23)};
    let id: string;
    
    beforeEach(async () => {
        sut = new AuthorAdapterInMemory();
        id = await sut.Create(newAuthor);
    });
    
    it("Should properly update an existing entity", async() => {
        expect(await sut.Update(id, updatedAuthor)).toBe(true);

        const createdAuthor = await sut.GetOne(id);

        expect(createdAuthor).toBeDefined();
        expect(createdAuthor).toEqual(updatedAuthor);
    });

    it("Should not allow edition of an inexistent entity", async() => {
        expect(await sut.Update("-5", updatedAuthor)).toBe(false);
    });
});

describe("Entity Deletion", () => {
    let sut: AuthorAdapterInMemory;
    const newAuthor: iAuthor = {name: "Eddy", birth_date: new Date(1996, 8, 23)};
    let id: string;
    
    beforeEach(async () => {
        sut = new AuthorAdapterInMemory();
        id = await sut.Create(newAuthor);
    });
    
    it("Should properly update an existing entity", async() => {
        expect(await sut.Delete(id)).toBe(true);

        const deletedAuthor = await sut.GetOne(id);

        expect(deletedAuthor).toBeNull();
    });

    it("Should not allow edition of an inexistent entity", async() => {
        expect(await sut.Delete("-5")).toBe(false);
    });
})
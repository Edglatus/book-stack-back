import GenericAdapterInMemory from "../../../src/adapter/inMemory/generic";
import UserAdapterInMemory from "../../../src/adapter/inMemory/user";
import { iUser } from "../../../src/model/user";

describe("Entity Creation", () => {
    let sut: UserAdapterInMemory;
    const newUser_a: iUser = {username: "Eddy", password: "123Batata"};
    const newUser_b: iUser = {username: "Josué", password: "123Batata"};
    
    beforeEach(() => {
        sut = new UserAdapterInMemory();
    });
    
    it("Should properly create an entity", async() => {
        let id = await sut.Create(newUser_a);

        expect(id).toBeDefined();
        expect(id).not.toBe("");
        newUser_a.id = id;
        
        const createdUser = await sut.GetOne(id);

        expect(createdUser).toBeDefined();
        expect(createdUser).toEqual(newUser_a);
    });

    it("Should not allow double creation of entities", async() => {
        let id = await sut.Create(newUser_a);

        expect(id).toBeDefined();
        expect(id).not.toBe("");

        id = await sut.Create(newUser_a);

        expect(id).toBeDefined();
        expect(id).toBe("");
    });

    it("Should properly add multiple different entities", async() => {
        const id_a = await sut.Create(newUser_a);

        expect(id_a).toBeDefined();
        expect(id_a).not.toBe("");
        newUser_a.id = id_a;
        
        const id_b = await sut.Create(newUser_b);

        expect(id_b).toBeDefined();
        expect(id_b).not.toBe("");
        newUser_b.id = id_b;
        
        const userList = await sut.GetAll();

        expect(userList).toBeDefined();
        expect(userList).toContainEqual(newUser_a);
        expect(userList).toContainEqual(newUser_b);
    });
});

describe("Entity Edition", () => {
    let sut: UserAdapterInMemory;
    const newUser: iUser = {username: "Eddy", password: "123Batata"};
    const updatedUser: iUser = {username: "Eddy", password: "66613"};
    let id: string;
    
    beforeEach(async () => {
        sut = new UserAdapterInMemory();
        id = await sut.Create(newUser);
    });
    
    it("Should properly update an existing entity", async() => {
        expect(await sut.Update(id, updatedUser)).toBe(true);

        const createdUser = await sut.GetOne(id);

        expect(createdUser).toBeDefined();
        expect(createdUser).toEqual(updatedUser);
    });

    it("Should not allow edition of an inexistent entity", async() => {
        expect(await sut.Update("-5", updatedUser)).toBe(false);
    });
});

describe("Entity Deletion", () => {
    let sut: UserAdapterInMemory;
    const newUser: iUser = {username: "Eddy", password: "123Batata"};
    let id: string;
    
    beforeEach(async () => {
        sut = new UserAdapterInMemory();
        id = await sut.Create(newUser);
    });
    
    it("Should properly update an existing entity", async() => {
        expect(await sut.Delete(id)).toBe(true);

        const deletedUser = await sut.GetOne(id);

        expect(deletedUser).toBeNull();
    });

    it("Should not allow edition of an inexistent entity", async() => {
        expect(await sut.Delete("-5")).toBe(false);
    });
})
import iAdapter from "../../../src/adapter/adapter";
import iDomainObject from "../../../src/model/domainObject";


export default function TestAdapter<T extends iDomainObject>(adapter: iAdapter<T>, message: string, createdObj_a: T, createdObj_b: T, obj_a_clone: T, updatedObj: T) {
    describe(message, () => {
        let sut: iAdapter<T>;

        it("Should Create Adapter properly", async () => {
            sut = await adapter.CreateAdapter();
            expect(sut).toBeDefined();
        });

        it("Should Identify Object of Type", async () => {
            sut = await adapter.CreateAdapter();

            const success = adapter.isObjectOfType(createdObj_a);
            expect(success).toBe(true);
        });

        it("Should Identify reject invalid objects", async () => {
            sut = await adapter.CreateAdapter();

            let success = adapter.isObjectOfType(undefined);
            expect(success).toBe(false);

            success = adapter.isObjectOfType({});
            expect(success).toBe(false);
        });

        describe("Entity Creation", () => {
            
            beforeEach(async () => {
                sut = await adapter.CreateAdapter();
            });
            
            it("Should properly create an entity", async() => {
                let id = await sut.Create(createdObj_a);
        
                expect(id).toBeDefined();
                expect(id).not.toBe("");
                createdObj_a.id = id;
                
                const createdAuthor = await sut.GetOne(id);
        
                expect(createdAuthor).toBeDefined();
                expect(createdAuthor).toMatchObject(createdObj_a);
            });
        
            it("Should not allow double creation of entities", async() => {
                let id = await sut.Create(createdObj_a);
        
                expect(id).toBeDefined();
                expect(id).not.toBe("");
        
                id = await sut.Create(obj_a_clone);
        
                expect(id).toBeDefined();
                expect(id).toBe("");
            });
        
            it("Should properly add multiple different entities", async() => {
                const id_a = await sut.Create(createdObj_a);
        
                expect(id_a).toBeDefined();
                expect(id_a).not.toBe("");
                createdObj_a.id = id_a;
                
                const id_b = await sut.Create(createdObj_b);
        
                expect(id_b).toBeDefined();
                expect(id_b).not.toBe("");
                createdObj_b.id = id_b;
                
                const AuthorList = await sut.GetAll();
        
                expect(AuthorList).toBeDefined();
                expect(AuthorList).toContainEqual(
                    expect.objectContaining(createdObj_a)
                );
                expect(AuthorList).toContainEqual(
                    expect.objectContaining(createdObj_b)
                );
            });
        });
        
        describe("Entity Edition", () => {
            let id: string;
            
            beforeEach(async () => {
                sut = await adapter.CreateAdapter();
                id = await sut.Create(createdObj_a);
                updatedObj.id = id;
            });
            
            it("Should properly update an existing entity", async() => {
                expect(await sut.Update(id, updatedObj)).toBe(true);
        
                const createdAuthor = await sut.GetOne(id);
        
                expect(createdAuthor).toBeDefined();
                expect(createdAuthor).toMatchObject(updatedObj);
            });
        
            it("Should not allow edition of an inexistent entity", async() => {
                expect(await sut.Update("-5", updatedObj)).toBe(false);
            });
        });
        
        describe("Entity Deletion", () => {
            let id: string;
            
            beforeEach(async () => {
                sut = await adapter.CreateAdapter();
                id = await sut.Create(createdObj_a);
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
    });
}
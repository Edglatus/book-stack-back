import UserAdapterInMemory from "../../../../src/adapter/inMemory/user";
import { iUserAdapter } from "../../../../src/adapter/user";
import { iUser } from "../../../../src/model/user";

describe("Authentication In Memory Adapter Tests", () => {
    let sut: iUserAdapter; 
    let user: iUser;

    beforeAll(async () => {
        sut = new UserAdapterInMemory();
        user = {email: "Eddy@mail.com", password: "123Batata$"};
        user.id = await sut.Create(user);        
    });

    it("Should not allow an invalid user", async () => {
        expect(await sut.Authenticate("Edglatus", user.password)).toEqual({success: false, user: null});
    });
    it("Should not allow a user with a wrong password", async () => {
        expect(await sut.Authenticate(user.email, "123batata")).toEqual({success: false, user: null});
    });
    it("Should allow a valid user", async () => {
        expect(await sut.Authenticate(user.email, user.password)).toEqual({success: true, user: user});
    });
});
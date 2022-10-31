import UserMongo from "../../../../src/adapter/mongo/model/user";
import UserAdapterMongo from "../../../../src/adapter/mongo/user";
import { iUserAdapter } from "../../../../src/adapter/user";
import { iUser } from "../../../../src/model/user";
import { Connection } from "mongoose";
import ConnectToDatabase from "../../../../src/adapter/mongo/connection";

describe("Authentication In Memory Adapter Tests", () => {
    let sut: iUserAdapter
    let user: iUser;

    let connection: Connection;

    beforeAll(async () => {
        connection = await ConnectToDatabase("mongodb://mongo:27017/test", "admin", "admin");

        const model = new UserMongo();
        sut = new UserAdapterMongo(model);

        user = {email: "Eddy@mail.com", password: "123Batata$"};
        user.id = await sut.Create(user);
    });
    afterAll(async() => {
        await connection.dropDatabase();
        connection.close();
    });

    it("Should not allow an invalid user", async () => {
        expect(await sut.Authenticate("Edglatus", user.password)).toMatchObject({success: false, user: null});
    });
    it("Should not allow a user with a wrong password", async () => {
        expect(await sut.Authenticate(user.email, "123batata")).toMatchObject({success: false, user: null});
    });
    it("Should allow a valid user", async () => {
        expect(await sut.Authenticate(user.email, user.password)).toMatchObject({success: true, user: user});
    });
});
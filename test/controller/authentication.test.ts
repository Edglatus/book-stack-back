import httpMocks from 'node-mocks-http';
import { iUserAdapter } from "../../src/adapter/user";
import { iUser } from "../../src/model/user";
import iController, { GenericController } from "../../src/controller/controller";
import UserAdapterInMemory from '../../src/adapter/inMemory/user';
import { AuthenticationControler as AuthenticationController } from '../../src/controller/authentication';



describe("Authorization Controller Tests", () => {
    let adapter: iUserAdapter;
    let sut: AuthenticationController;
    let controller: iController<iUser>;

    let getReq: httpMocks.MockRequest<any>;
    let createReq: httpMocks.MockRequest<any>;

    let id: string;

    const user: iUser = {username: "Eddy", password: "123Batata"};

    beforeAll(async () => {
        adapter = new UserAdapterInMemory();
        sut = new AuthenticationController(adapter);
        controller = new GenericController(adapter);

        const response: httpMocks.MockResponse<any> = await controller.Create(httpMocks.createRequest({body: user}), httpMocks.createResponse());
        id = response._getJSONData().data.id;  
    });

    beforeEach(() => {
        getReq = httpMocks.createRequest();
    });

    it("Should not allow an invalid user", async () => {
        getReq.body = {username: "Edglatus", password: "123Batata"};

        const response: httpMocks.MockResponse<any> = await sut.Authenticate(getReq, httpMocks.createResponse());
        expect(response.statusCode).toBe(403);
        
        const resData = response._getJSONData();
        expect(resData.data).toBe(undefined);

        const success: boolean = resData.success;
        expect(success).toBe(false);
    });
    it("Should not allow a user with a wrong password", async () => {
        getReq.body = {username: "Eddy", password: "123batata"};

        const response: httpMocks.MockResponse<any> = await sut.Authenticate(getReq, httpMocks.createResponse());
        expect(response.statusCode).toBe(403);
        
        const resData = response._getJSONData();
        expect(resData.data).toBe(undefined);

        const success: boolean = resData.success;
        expect(success).toBe(false);
    });
    it("Should allow a valid user", async () => {
        getReq.body = {username: "Eddy", password: "123Batata"};

        const response: httpMocks.MockResponse<any> = await sut.Authenticate(getReq, httpMocks.createResponse());
        expect(response.statusCode).toBe(202);
        
        const resData = response._getJSONData();
        expect(resData.data).toBeDefined();
        expect(resData.data).toEqual(user);

        const success: boolean = resData.success;
        expect(success).toBe(true);
    });
});
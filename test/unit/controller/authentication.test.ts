import httpMocks from 'node-mocks-http';
import { iUserAdapter } from "../../../src/adapter/user";
import { iUser } from "../../../src/model/user";
import iController, { GenericController } from "../../../src/controller/controller";
import UserAdapterInMemory from '../../../src/adapter/inMemory/user';
import { AuthenticationController as AuthenticationController } from '../../../src/controller/authentication';



describe("Authentication Controller Tests", () => {
    let adapter: iUserAdapter;
    let sut: AuthenticationController;
    let controller: iController<iUser>;

    let getReq: httpMocks.MockRequest<any>;
    let createReq: httpMocks.MockRequest<any>;

    let id: string;

    const user: iUser = {email: "Eddy@mail.com", password: "123Batata$"};

    beforeAll(async () => {
        adapter = new UserAdapterInMemory();
        sut = new AuthenticationController();
        controller = new GenericController();

        const response: httpMocks.MockResponse<any> = await controller.Create(httpMocks.createRequest({body: user}), httpMocks.createResponse(), adapter);
        id = response._getJSONData().data.id;  
    });

    beforeEach(() => {
        getReq = httpMocks.createRequest();
    });

    it("Should return 403 on an invalid user", async () => {
        getReq.body = {email: "Edglatus", password: user.password};

        const response: httpMocks.MockResponse<any> = await sut.Authenticate(getReq, httpMocks.createResponse(), adapter);
        expect(response.statusCode).toBe(403);
        
        const resData = response._getJSONData();
        expect(resData.data).toBe(undefined);

        const success: boolean = resData.success;
        expect(success).toBe(false);
    });
    it("Should return 403 on an user with a wrong password", async () => {
        getReq.body = {email: user.email, password: "123batata"};

        const response: httpMocks.MockResponse<any> = await sut.Authenticate(getReq, httpMocks.createResponse(), adapter);
        expect(response.statusCode).toBe(403);
        
        const resData = response._getJSONData();
        expect(resData.data).toBe(undefined);

        const success: boolean = resData.success;
        expect(success).toBe(false);
    });
    it("Should return 202 and success status on a valid user", async () => {
        getReq.body = {email: user.email, password: user.password};

        const response: httpMocks.MockResponse<any> = await sut.Authenticate(getReq, httpMocks.createResponse(), adapter);
        expect(response.statusCode).toBe(202);
        
        const resData = response._getJSONData();
        expect(resData.data).toBeDefined();
        expect(resData.data).toEqual(user);

        const success: boolean = resData.success;
        expect(success).toBe(true);
    });
});
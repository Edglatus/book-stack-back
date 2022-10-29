import iAdapter from "../../../src/adapter/adapter";
import httpMocks from "node-mocks-http";
import UserAdapterInMemory from "../../../src/adapter/inMemory/user";
import iController, {GenericController} from "../../../src/controller/controller";
import { iUser } from "../../../src/model/user";


let adapter: iAdapter<iUser>;
let sut: iController<iUser>;

let getReq: httpMocks.MockRequest<any>;
let createReq: httpMocks.MockRequest<any>;

const newUser_a: iUser = {email: "Eddy", password: "123Batata"};
const newUser_b: iUser = {email: "Josué", password: "123Batata"};
const user_a_clone: iUser = {email: "Eddy", password: "66613"};

describe("Entity Acquisition", () => {    
    beforeEach(() => {
        adapter = new UserAdapterInMemory();
        sut = new GenericController<iUser>();

        getReq = httpMocks.createRequest();
    });

    it("Should return 404 for nonexistent id", async () => {
        getReq.params.id = "0";

        const response: httpMocks.MockResponse<any> = await sut.GetOne(getReq, httpMocks.createResponse(), adapter);
        
        expect(response.statusCode).toEqual(404);
        
        const getData = response._getJSONData().data;
        
        expect(getData).not.toBeDefined();
    });

    it("Should return an empty list when no entities have been added", async () => {
        const response: httpMocks.MockResponse<any> = await sut.GetAll(getReq, httpMocks.createResponse(), adapter);
        
        expect(response.statusCode).toEqual(200);
        
        const getData: Array<any> = response._getJSONData().data;
        
        expect(getData).toBeDefined();
        expect(getData.length).toEqual(0);
    });    

    it("Should return 500 on undefined id", async() => {
        getReq.id = undefined;

        let res_a: httpMocks.MockResponse<any> = await sut.GetOne(getReq, httpMocks.createResponse(), adapter);
        expect(res_a.statusCode).toEqual(500);
    });
});


describe("Entity Creation", () => {    
    beforeEach(() => {
        adapter = new UserAdapterInMemory();
        sut = new GenericController<iUser>();
        
        createReq  = httpMocks.createRequest();
        getReq = httpMocks.createRequest();
    });
    

    it("Should properly create an entity", async() => {
        createReq.body = newUser_a;

        let res: httpMocks.MockResponse<any> = await sut.Create(createReq, httpMocks.createResponse(), adapter);
        
        expect(res.statusCode).toEqual(200);

        const data: iUser = res._getJSONData().data;
        expect(data).toBeDefined();

        newUser_a.id = data.id;
        expect(data).toEqual(newUser_a);
        
        getReq.params.id = newUser_a.id;

        const createdUserResponse: httpMocks.MockResponse<any> = await sut.GetOne(getReq, httpMocks.createResponse(), adapter);
        
        expect(createdUserResponse.statusCode).toEqual(200);
        
        const getData = createdUserResponse._getJSONData().data;
        
        expect(getData).toBeDefined();
        expect(getData).toEqual(newUser_a);
    });

    it("Should not allow double creation of entities", async() => {
        createReq.body = newUser_a;

        let res: httpMocks.MockResponse<any> = await sut.Create(createReq, httpMocks.createResponse(), adapter);
        expect(res.statusCode).toEqual(200);

        const data: iUser = res._getJSONData().data;
        expect(data).toBeDefined();
        
        createReq.body = user_a_clone;

        let resDuplicate: httpMocks.MockResponse<any> = await sut.Create(createReq, httpMocks.createResponse(), adapter);
        expect(resDuplicate.statusCode).toEqual(409);

        const dataDuplicate: iUser = resDuplicate._getJSONData().data;
        expect(dataDuplicate).not.toBeDefined();
    });

    it("Should properly add multiple different entities", async() => {
        createReq.body = newUser_a;

        let res_a: httpMocks.MockResponse<any> = await sut.Create(createReq, httpMocks.createResponse(), adapter);
        expect(res_a.statusCode).toEqual(200);

        const data_a: iUser = res_a._getJSONData().data;
        expect(data_a).toBeDefined();
        
        createReq.body = newUser_b;

        let res_b: httpMocks.MockResponse<any> = await sut.Create(createReq, httpMocks.createResponse(), adapter);
        expect(res_b.statusCode).toEqual(200);

        const data_b: iUser = res_b._getJSONData().data;
        expect(data_b).toBeDefined();
        
        const getData: httpMocks.MockResponse<any> = await sut.GetAll(getReq, httpMocks.createResponse(), adapter);

        const userList = getData._getJSONData().data;
        
        expect(userList).toBeDefined();
        expect(userList).toContainEqual(newUser_a);
        expect(userList).toContainEqual(newUser_b);
    });

    it("Should return 500 on undefined request body", async() => {
        createReq.body = undefined;

        let res_a: httpMocks.MockResponse<any> = await sut.Create(createReq, httpMocks.createResponse(), adapter);
        expect(res_a.statusCode).toEqual(500);
    });
});

describe("Entity Edition", () => {
    let id: string;
    
    beforeEach(async () => {
        adapter = new UserAdapterInMemory();
        sut = new GenericController<iUser>();

        getReq = httpMocks.createRequest();
        const response: httpMocks.MockResponse<any> = await sut.Create(httpMocks.createRequest({body: newUser_a}), httpMocks.createResponse(), adapter);
        id = response._getJSONData().data.id;
    });
    
    it("Should properly update an existing entity", async() => {
        getReq.body = user_a_clone;
        getReq.params.id = id;

        expect((await sut.Update(getReq, httpMocks.createResponse(), adapter)).statusCode).toBe(200);

        const response: httpMocks.MockResponse<any> = await sut.GetOne(getReq, httpMocks.createResponse(), adapter);
        const createdUser: iUser = response._getJSONData().data;

        expect(createdUser).toBeDefined();
        expect(createdUser).toEqual(user_a_clone);
    });

    it("Should not allow edition of an inexistent entity", async() => {
        getReq.body = user_a_clone;
        getReq.params.id = "-5";

        expect((await sut.Update(getReq, httpMocks.createResponse(), adapter)).statusCode).toBe(404);
    });

    it("Should return 500 on undefined body", async() => {
        getReq.params.id = id;
        getReq.body = undefined;

        let res_a: httpMocks.MockResponse<any> = await sut.Update(getReq, httpMocks.createResponse(), adapter);
        expect(res_a.statusCode).toEqual(500);
    });

    it("Should return 500 on undefined id", async() => {
        getReq.params.id = undefined;

        let res_a: httpMocks.MockResponse<any> = await sut.Update(getReq, httpMocks.createResponse(), adapter);
        expect(res_a.statusCode).toEqual(500);
    });
});

describe("Entity Deletion", () => {
    let id: string;
    
    beforeEach(async () => {
        adapter = new UserAdapterInMemory();
        sut = new GenericController<iUser>();

        getReq = httpMocks.createRequest();
        const response: httpMocks.MockResponse<any> = await sut.Create(httpMocks.createRequest({body: newUser_a}), httpMocks.createResponse(), adapter);
        id = response._getJSONData().data.id;
    });
    
    it("Should properly delete an existing entity", async() => {
        getReq.params.id = id;

        expect((await sut.Delete(getReq, httpMocks.createResponse(), adapter)).statusCode).toBe(200);

        const response: httpMocks.MockResponse<any> = await sut.GetOne(getReq, httpMocks.createResponse(), adapter);        
        expect(response.statusCode).toEqual(404);
        
        const getData = response._getJSONData().data;        
        expect(getData).not.toBeDefined();
    });

    it("Should not allow deletion of an inexistent entity", async() => {
        getReq.params.id = "-5";

        expect((await sut.Delete(getReq, httpMocks.createResponse(), adapter)).statusCode).toBe(404);
    });

    it("Should return 500 on undefined id", async() => {
        getReq.params.id = undefined;

        let res_a: httpMocks.MockResponse<any> = await sut.Delete(getReq, httpMocks.createResponse(), adapter);
        expect(res_a.statusCode).toEqual(500);
    });
});
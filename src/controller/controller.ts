import express from "express"
import { isUndefined } from "util";
import iAdapter from "../adapter/adapter"
import iDomainObject from "../model/domainObject";

export default interface iController<T extends iDomainObject> {
    GetOne(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response>;
    GetAll(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response>;
    Create(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response>;
    Update(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response>;
    Delete(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response>;
}

export class GenericController<T extends iDomainObject> implements iController<T> {
    async GetOne(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response> {
        try {
            const id: string = request.params.id;

            if(id === undefined || id.trim() == "")
                throw new TypeError("ID is Undefined");

            let obj: T | null = await adapter.GetOne(id);

            if(!adapter.isObjectOfType(obj))
                return response.status(404).json({"message": "Object not Found"})
            else
                return response.status(200).json({"data": obj});
        }
        catch(e) {
            return GenericController.handleError(e, response);
        }
    }
    async GetAll(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response> {
        try {
            let objs: T[] = await adapter.GetAll();

            return response.status(200).json({"data": objs});
        }
        catch(e) {
            return GenericController.handleError(e, response);
        }
    }
    async Create(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response> {
        try {
            let obj = request.body;
            
            if(!adapter.isObjectOfType(obj))
                throw new TypeError("Object is Undefined");

            let success = await adapter.Create(obj as T);

            if(success)
                return response.status(200).json({"data": {id: success, ...obj}});
            else
                return response.status(409).json({"message": "Object already exists."});
        }
        catch(e) {
            return GenericController.handleError(e, response);
        }
    }
    async Update(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response> {
        try {
            const id: string = request.params.id;
            
            if(id === undefined || id.trim() == "")
                throw new TypeError("ID is Undefined");

            let obj: T = request.body;

            if(!adapter.isObjectOfType(obj))
                throw new TypeError("Object is Undefined");

            const success: boolean = await adapter.Update(id, obj);
            const status: number = success ? 200 : 404;
            const message: string = success ? "Object updated." : "Object not Found";

            return response.status(status).json({"success": success, "message": message});
        }
        catch(e) {
            return GenericController.handleError(e, response);
        }
    }
    async Delete(request: express.Request, response: express.Response, adapter: iAdapter<T>): Promise<express.Response> {
        try {
            const id: string = request.params.id;

            if(id === undefined || id.trim() == "")
                throw new TypeError("ID is Undefined");


            const success: boolean = await adapter.Delete(id);
            const status: number = success ? 200 : 404;
            const message: string = success ? "Object updated." : "Object not Found";

            return response.status(status).json({"success": success, "message": message});
        }
        catch(e) {
            return GenericController.handleError(e, response);
        }
    }

    private static handleError(e: unknown, response: express.Response): express.Response {
        let message: string = "";

        if (typeof e === "string") {
            message = e.toUpperCase()
        } else if (e instanceof Error) {
            message = e.message
        }

        return response.status(500).json({"message": message});
    }
}
import express from "express"
import iAdapter from "../adapter/adapter"
import iDomainObject from "../model/domainObject";

export default interface iController<T extends iDomainObject> {
    adapter: iAdapter<T>;
    getOne(request: express.Request, response: express.Response): Promise<express.Response>;
    getAll(request: express.Request, response: express.Response): Promise<express.Response>;
    create(request: express.Request, response: express.Response): Promise<express.Response>;
    update(request: express.Request, response: express.Response): Promise<express.Response>;
    delete(request: express.Request, response: express.Response): Promise<express.Response>;
}

export default class GenericController<T> implements iController<T> {
    adapter: iAdapter<T>;
    async getOne(request: express.Request, response: express.Response): Promise<express.Response> {
        try {
            const id: string = request.params.id;
            let obj: T | null = await this.adapter.GetOne(id);

            if(obj === null)
                return response.status(404).json({"message": "Object not Found"})
            else
                return response.status(200).json(obj);
        }
        catch(e) {
            return this.handleError(e, response);
        }
    }
    async getAll(request: express.Request, response: express.Response): Promise<express.Response> {
        try {
            let objs: T[] = await this.adapter.GetAll();

            return response.status(200).json(objs);
        }
        catch(e) {
            return this.handleError(e, response);
        }
    }
    async create(request: express.Request, response: express.Response): Promise<express.Response> {
        try {
            let obj: T = request.body;
            let success = await this.adapter.Create(obj);

            if(success)
                return response.status(200).json(obj);
            else
                return response.status(409).json({"message": "Object already exists."});
        }
        catch(e) {
            return this.handleError(e, response);
        }
    }
    async update(request: express.Request, response: express.Response): Promise<express.Response> {
        try {
            const id: string = request.params.id;
            let obj: T = request.body;
            const success: boolean = await this.adapter.Update(id, obj);
            const status: number = success ? 200 : 404;
            const message: string = success ? "Object updated." : "Object not Found";

            return response.status(status).json({"success": success, "message": message});
        }
        catch(e) {
            return this.handleError(e, response);
        }
    }
    async delete(request: express.Request, response: express.Response): Promise<express.Response> {
        try {
            const id: string = request.params.id;
            const success: boolean = await this.adapter.Delete(id);
            const status: number = success ? 200 : 404;
            const message: string = success ? "Object updated." : "Object not Found";

            return response.status(status).json({"success": success, "message": message});
        }
        catch(e) {
            return this.handleError(e, response);
        }
    }

    private handleError(e: unknown, response: express.Response): express.Response {
        let message: string = "";

        if (typeof e === "string") {
            message = e.toUpperCase()
        } else if (e instanceof Error) {
            message = e.message
        }

        return response.status(500).json({"message": message});
    }

    constructor(adapter: iAdapter<T>){
        this.adapter = adapter;
    }
}
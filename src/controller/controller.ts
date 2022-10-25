import express from "express"
import iAdapter from "../adapter/adapter"

export default interface iController<T> {
    adapter: iAdapter<T>;
    getOne(request: express.Request, response: express.Response): Promise<express.Response>;
    getAll(request: express.Request, response: express.Response): Promise<express.Response>;
    create(request: express.Request, response: express.Response): Promise<express.Response>;
    update(request: express.Request, response: express.Response): Promise<express.Response>;
    delete(request: express.Request, response: express.Response): Promise<express.Response>;
}

export default class Controller<T> implements iController<T> {
    adapter: iAdapter<T>;
    async getOne(request: express.Request, response: express.Response): Promise<express.Response> {
        try {
            const id: string = request.params.id;
            let obj: T = await this.adapter.GetOne(id);

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
            await this.adapter.Create(obj);

            return response.status(200).json(obj);
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

            return response.status(status).json({"success": success});
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

            return response.status(status).json({"success": success});
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

        return response.status(500).json(message);
    }

    constructor(adapter: iAdapter<T>){
        this.adapter = adapter;
    }
}
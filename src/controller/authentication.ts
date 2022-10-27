import { iUser } from "../model/user";
import express from 'express';
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { iUserAdapter } from "../adapter/user";

export default interface iAuthenticationController {
    adapter: iUserAdapter;
    Authenticate(request: express.Request, response: express.Response): Promise<express.Response>;
}

export class AuthenticationControler implements iAuthenticationController {
    adapter: iUserAdapter;
    async Authenticate(request: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: express.Response<any, Record<string, any>>): Promise<express.Response<any, Record<string, any>>> {
        const obj: iUser = request.body;
        const auth = await this.adapter.Authenticate(obj.username, obj.password);

        if(auth.success) {
            return response.status(202).json({"data": auth.user, "success": auth.success});
        }
        
        return response.status(403).json({"success": false})
    }

    constructor(adapter: iUserAdapter) {
        this.adapter = adapter;
    }
}
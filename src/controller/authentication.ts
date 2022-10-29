import { iUser } from "../model/user";
import express from 'express';
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { iUserAdapter } from "../adapter/user";

export default interface iAuthenticationController {
    Authenticate(request: express.Request, response: express.Response, adapter: iUserAdapter): Promise<express.Response>;
}

export class AuthenticationController implements iAuthenticationController {
    async Authenticate(request: express.Request, response: express.Response, adapter: iUserAdapter): Promise<express.Response> {
        const obj: iUser = request.body;
        const auth = await adapter.Authenticate(obj.email, obj.password);

        if(auth.success) {
            return response.status(202).json({"data": auth.user, "success": auth.success});
        }
        
        return response.status(403).json({"success": false})
    }
}
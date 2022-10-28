import express, { Router } from "express";
import iAuthenticationController from "../controller/authentication";
import { iUserAdapter } from "../adapter/user";

export default class AuthenticationRouter {
    static CreateRoutes(controller: iAuthenticationController, adapter: iUserAdapter): Router {
        const router: Router = express.Router();

        router.route("/")
            .post((req, res) => controller.Authenticate(req, res, adapter));

        return router;
    }
}
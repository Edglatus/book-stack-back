import iController from "../controller/controller";
import express, { Router } from "express";
import iDomainObject from "../model/domainObject";
import iAdapter from "../adapter/adapter";

export default class GenericRouter {
    static CreateRoutes<T extends iDomainObject>(controller: iController<T>, adapter: iAdapter<T>): Router {
        const router: Router = express.Router();

        router.route("/")
            .get((req, res) => controller.GetAll(req, res, adapter))
            .post((req, res) => controller.Create(req, res, adapter));

        router.route("/:id")
            .get((req, res) => controller.GetOne(req, res, adapter))
            .put((req, res) => controller.Update(req, res, adapter))
            .delete((req, res) => controller.Delete(req, res, adapter));

        return router;
    }
}
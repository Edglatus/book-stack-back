import iController from "../controller/controller";
import express, { Router } from "express";
import iDomainObject from "../model/domainObject";

export default class GenericRouter {
    static CreateRoutes<T extends iDomainObject>(controller: iController<T>): Router {
        const router: Router = express.Router();

        router.route("/")
            .get(controller.GetAll)
            .post(controller.Create);

        router.route("/:id")
            .get(controller.GetOne)
            .put(controller.Update)
            .delete(controller.Delete);

        return router;
    }
}
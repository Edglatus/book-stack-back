import iController from "../controller/controller";
import { Express } from "express";
import iDomainObject from "../model/domainObject";

export default class GenericRouter {
    static CreateRoutes<T extends iDomainObject>(app: Express, controller: iController<T>, baseRouteName: string) {
        app.route("/" + baseRouteName)
            .get(controller.getAll)
            .post(controller.create)
            .put(controller.update)
            .delete(controller.delete);

        app.route("/" + baseRouteName + "/id/:id").get(controller.getOne);
    }
}
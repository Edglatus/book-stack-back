import iController from "../controller/controller";
import { Express } from "express";
import iDomainObject from "../model/domainObject";

export default class GenericRouter {
    static CreateRoutes<T extends iDomainObject>(app: Express, controller: iController<T>, baseRouteName: string) {
        app.route("/" + baseRouteName)
            .get(controller.GetAll)
            .post(controller.Create)
            .put(controller.Update)
            .delete(controller.Delete);

        app.route("/" + baseRouteName + "/id/:id").get(controller.GetOne);
    }
}
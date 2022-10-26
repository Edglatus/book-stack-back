import iController from "../controller/controller";
import { Express } from "express";

export default class GenericRouter {
    static CreateRoutes<T>(app: Express, controller: iController<T>, baseRouteName: string) {
        app.route("/" + baseRouteName)
            .get(controller.getAll)
            .post(controller.create)
            .put(controller.update)
            .delete(controller.delete);

        app.route("/" + baseRouteName + "/id/:id").get(controller.getOne);
    }
}
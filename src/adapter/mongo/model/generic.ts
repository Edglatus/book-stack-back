import iDomainObject from "../../../model/domainObject";
import mongoose, { Model, Schema, Document } from "mongoose";
import iMongoModel from "./model";

export default abstract class GenericModel<T extends iDomainObject> implements iMongoModel<T> {
    private _schema: Schema<T, Model<T>>;
    private _model: Model<T>;

    ConvertToDoc(model: T): Document<any, any, T> | null {
        if(this.isObjectOfType(model)) {
            const doc = new this._model(model);

            return doc;
        }

        return null;
    }
    ConvertToModel(doc: Document<string, any, T>): T {
        const model = this._model.hydrate(doc);

        return model;
    }

    get schema(): Schema<T, Model<T>> {
        return this._schema;
    }
    get model(): Model<T> {
        return this._model;
    }

    abstract isObjectOfType(object: any): boolean;
    protected abstract CreateSchema(): Schema<T, Model<T>>;
    protected abstract CreateModel(schema: Schema<T, Model<T>>): Model<T>;

    constructor() {
        this._schema = this.CreateSchema();
        this._model = this.CreateModel(this._schema);
    }
}
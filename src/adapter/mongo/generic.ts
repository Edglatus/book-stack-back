import { Schema, Document, Connection, Model } from "mongoose";
import iDomainObject from "../../model/domainObject";
import iAdapter from "../adapter";
import iMongoModel from "./model/model";

export default abstract class GenericAdapterMongo<T extends iDomainObject> implements iAdapter<T> {
    private connection: Connection;
    private model: iMongoModel<T>;
    
    async GetOne(id: string): Promise<T | null> {
        const found = await this.model.model.findById(id).exec();

        return found;
    }
    async GetAll(): Promise<T[]> {
        const found = await this.model.model.find().exec();

        return found;
    }
    async Create(object: T): Promise<string> {
        try {
            if(!this.isObjectOfType(object))
                throw new TypeError("Object is of Incorrect type");

            const doc = this.model.ConvertToMongo(object);
            if(doc.isNew)
                await doc.save();
            else
                throw new Error("Object already exists");
            
            return Promise.resolve(doc.id);
        }
        catch {
            return Promise.resolve("");
        }
    }
    async Update(id: string, object: T): Promise<boolean> {
        try {
            if(!this.isObjectOfType(object))
                throw new TypeError("Object is of Incorrect type");

            const doc = this.model.ConvertToMongo(object);
            if(!doc.isNew)
                await doc.save();
            else
                throw new Error("Object not found");
            
            return Promise.resolve(true);
        }
        catch {
            return Promise.resolve(false);
        }
    }
    async Delete(id: string): Promise<boolean> {
        const document = await this.model.model.findById(id).exec();

        if(document !== null) {
            document.delete();
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    abstract isObjectOfType(object: any): boolean;
    
    abstract CreateAdapter(): iAdapter<T>;

    constructor(con: Connection, model: iMongoModel<T>) {
        this.connection = con;
        this.model = model;
    }
}
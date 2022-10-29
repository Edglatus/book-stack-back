import { Schema, Document, Connection, Model } from "mongoose";
import iDomainObject from "../../model/domainObject";
import iAdapter from "../adapter";
import iMongoModel from "./model/model";

export default class GenericAdapterMongo<T extends iDomainObject> implements iAdapter<T> {
    private model: iMongoModel<T>;
    protected get Model(): iMongoModel<T> {
        return this.model;
    }
    
    async GetOne(id: string): Promise<T | null> {
        try {
            const found = await this.model.model.findById(id).exec();
            
            return found;
        }
        catch(e) {
            return null;
        }

    }
    async GetAll(): Promise<T[]> {
        const found = await this.model.model.find().exec();

        return found;
    }
    async Create(object: T): Promise<string> {
        try {
            if(!this.isObjectOfType(object))
                throw new TypeError("Object is of Incorrect type");

            const doc = this.model.ConvertToDoc(object);

            if(doc !== null) {
                await doc.save();
                return Promise.resolve(doc.id);
            }
        }
        catch(e) { }

        return Promise.resolve("");

    }
    async Update(id: string, object: T): Promise<boolean> {
        try {

            if(!this.isObjectOfType(object))
                throw new TypeError("Object is of Incorrect type");

            const doc = await this.model.model.findById(id);

            if(doc !== null) {
                await doc.updateOne(object).exec();
                return Promise.resolve(true);
            }
        }
        catch(e) { }

        return Promise.resolve(false);
    }
    async Delete(id: string): Promise<boolean> {
        try {
            const document = await this.model.model.findById(id).exec();
    
            if(document !== null) {
                await document.delete();
                return Promise.resolve(true);
            }
        } 
        catch(e) { }
        return Promise.resolve(false);
    }

    isObjectOfType(object: any): boolean {
        return this.model.isObjectOfType(object);
    }
    
    async CreateAdapter(): Promise<iAdapter<T>> {
        await this.model.model.deleteMany().exec();
        return this;
    }

    constructor(model: iMongoModel<T>) {
        this.model = model;
    }
}
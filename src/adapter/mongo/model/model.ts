import { Schema, Model, Document } from 'mongoose';
import iDomainObject from '../../../model/domainObject';

export default interface iMongoModel<T extends iDomainObject> {
    schema: Schema<T>;
    model: Model<T>;
    ConvertToDoc(model: T): Document<any, any, T> | null;
    ConvertToModel(doc: Document<any, any, T>): T;
    isObjectOfType(object: any): boolean;
}
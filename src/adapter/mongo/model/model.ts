import { Schema, Model, Document } from 'mongoose';

export default interface iMongoModel<T> {
    schema: Schema<T>;
    model: Model<T>;
    ConvertToMongo(model: T): Document<string, any, T>;
    ConvertToModel(mongo: Document<string, any, T>): T;
}
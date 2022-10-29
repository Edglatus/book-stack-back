import mongoose, { Schema, Model, Document } from "mongoose";
import { iUser } from "../../../model/user";
import GenericModel from "./generic";

export default class UserMongo extends GenericModel<iUser> {

    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && ("username" in object && "password" in object);
    }

    protected CreateSchema(): Schema<iUser, Model<iUser>> {
        const schema = new Schema<iUser>({
            username: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            }
        });

        schema.virtual('id').get(function(){
            return this._id.toHexString();
        });        
        schema.set('toJSON', { virtuals: true });
        schema.set('toObject', { virtuals: true });

        return schema;
    }
    protected CreateModel(schema: Schema<iUser, Model<iUser>>): Model<iUser> {
        const model = mongoose.model<iUser>("User", this.schema);
        return model;
    }

    constructor() {
        super();
    }
}
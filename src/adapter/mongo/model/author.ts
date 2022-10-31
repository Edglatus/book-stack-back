import { iAuthor } from "../../../model/author";
import mongoose, { Schema, Model } from "mongoose";
import GenericModel from "./generic";
import uniqueValidator from "mongoose-unique-validator";

export default class AuthorMongoModel extends GenericModel<iAuthor> {
    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && ("name" in object && "birth_date" in object);
    }

    protected CreateSchema(): Schema<iAuthor, Model<iAuthor>> {
        const schema = new Schema<iAuthor>({
            name: {
                type: String,
                required: true,
                unique: true
            },
            birth_date: {
                type: Date,
                required: true
            }
        });

        schema.virtual('id').get(function(){
            return this._id.toHexString();
        });
        schema.set('toJSON', { virtuals: true });
        schema.set('toObject', { virtuals: true });
        schema.plugin(uniqueValidator);

        return schema;
    }
    protected CreateModel(schema: Schema<iAuthor, Model<iAuthor>>): Model<iAuthor> {
        try {
            const model = mongoose.model<iAuthor>("Author", this.schema);
            return model;
        }
        catch {
            return mongoose.model<iAuthor>("Author");
        }
    }

    constructor() {
        super();
    }
}
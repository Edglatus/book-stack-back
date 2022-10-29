import { iBook } from "../../../model/book";
import mongoose, { Schema, Model } from "mongoose";
import GenericModel from "./generic";

export default class BookMongoModel extends GenericModel<iBook> {
    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && ("title" in object && "isbn" in object);
    }

    protected CreateSchema(): Schema<iBook, Model<iBook>> {
        const schema = new Schema<iBook>({
            title: {
                type: String,
                required: true
            },
            isbn: {
                type: String,
                required: true,
                unique: true
            },
            author_id: {
                type: String,
                required: true,
            },
            cover_url: {
                type: String,
                required: false
            },
            publishing_date: {
                type: Date,
                required: false
            }
        });

        schema.virtual('id').get(function(){
            return this._id.toHexString();
        });
        schema.virtual('_authorId').get(function(){
            return mongoose.Types.ObjectId.createFromHexString(this.author_id);
        });
        schema.set('toJSON', { virtuals: true });
        schema.set('toObject', { virtuals: true });

        return schema;
    }
    protected CreateModel(schema: Schema<iBook, Model<iBook>>): Model<iBook> {
        try {
            const model = mongoose.model<iBook>("Book", this.schema);
            return model;
        }
        catch {
            return mongoose.model<iBook>("Book");
        }
    }

    constructor() {
        super();
    }
}
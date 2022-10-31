import mongoose, { Schema, Model, Document } from "mongoose";
import { iUser } from "../../../model/user";
import GenericModel from "./generic";
import uniqueValidator from "mongoose-unique-validator";

export default class UserMongo extends GenericModel<iUser> {

    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && 
                ("email" in object && this.validateEmail(object.email)) && 
                ("password" in object && this.validatePassword(object.password));
    }
    
    private validateEmail(email: string): boolean {
        let validEmail: boolean;
        var emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        validEmail = emailRegex.test(email);
        if(!validEmail)
        console.log("Email :" + email);
        

        return validEmail;
    }
    private validatePassword(password: string): boolean {
        let validPassword: boolean;
        var passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])(?=.*\w).{8,}$/;

        validPassword = passwordRegex.test(password);
        if(!validPassword)
        console.log("Password :" + password);

        return validPassword;
    }

    protected CreateSchema(): Schema<iUser, Model<iUser>> {
        const schema = new Schema<iUser>({
            email: {
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
        schema.plugin(uniqueValidator);

        return schema;
    }
    protected CreateModel(schema: Schema<iUser, Model<iUser>>): Model<iUser> {
        try {
            const model = mongoose.model<iUser>("User", this.schema);

            return model;
        }
        catch {
            return mongoose.model<iUser>("User");
        }
    }

    constructor() {
        super();
    }
}
import { iUser } from "../../model/user";
import adapter from "../adapter";
import { iUserAdapter } from "../user";
import GenericAdapterMongo from "./generic";

export default class UserAdapterMongo extends GenericAdapterMongo<iUser> implements iUserAdapter {
    async Authenticate(email: string, pwd: string): Promise<{ success: boolean; user: iUser | null; }> {
        let success: boolean;

        const user: iUser | null = await this.GetByEmail(email);

        if(user === null) 
            success = false;
        else {
            if(pwd == user.password)
                success = true;
            else
                success = false;
        }

        return Promise.resolve({success, user: success ? user : null});
    }

    private async GetByEmail(email: string): Promise<iUser | null> {
        try {
            const found = await this.Model.model.findOne({"email": email}).exec();

            let obj: iUser | null;

            if(found !== undefined && found !== null) {
                obj = found.toObject();
            }
            else {
                obj = null;
            }

            return obj;
        }
        catch(e) { }

        return null;
    }

    async CreateAdapter(): Promise<iUserAdapter> {
        await super.CreateAdapter();
        return this;
    }
}
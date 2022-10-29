import { iUser } from "../../model/user";
import adapter from "../adapter";
import { iUserAdapter } from "../user";
import GenericAdapterMongo from "./generic";

export default class UserAdapterMongo extends GenericAdapterMongo<iUser> implements iUserAdapter {
    Authenticate(name: string, pwd: string): Promise<{ success: boolean; user: iUser | null; }> {
        throw new Error("Method not implemented.");
    }

    async CreateAdapter(): Promise<iUserAdapter> {
        await super.CreateAdapter();
        return this;
    }
}
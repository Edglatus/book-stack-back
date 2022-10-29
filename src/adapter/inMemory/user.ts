import { iUser } from "../../model/user";
import { iUserAdapter } from "../user";
import GenericAdapterInMemory from "./generic";

export default class UserAdapterInMemory extends GenericAdapterInMemory<iUser> implements iUserAdapter {
    
    Authenticate(email: string, pwd: string): Promise<{success: boolean, user: iUser | null}> {
        let success: boolean;

        const user: iUser | null = this.GetByEmail(email);

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

    protected Exists(object: iUser): boolean {
        const uEmail: string = object.email;

        for (const u of this._dict.values()) {
            let cEmail: string = u.email; 
            if(uEmail == cEmail)
                return true;
        }

        return false;
    }

    private GetByEmail(uEmail: string): iUser | null {
        for (const u of this._dict.values()) {
            let email = u.email;
            if(uEmail == email)
                return u;
        }

        return null;
    }

    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && ("email" in object && "password" in object);
    }
    
    async CreateAdapter(): Promise<iUserAdapter> {
        return Promise.resolve(new UserAdapterInMemory());
    }

    constructor() {
        super();
    }
}
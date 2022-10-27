import { iUser } from "../../model/user";
import { iUserAdapter } from "../user";
import GenericAdapterInMemory from "./generic";

export default class UserAdapterInMemory extends GenericAdapterInMemory<iUser> implements iUserAdapter {
    
    Authenticate(name: string, pwd: string): Promise<boolean> {
        let success: boolean;

        const obj: iUser | null = this.GetByName(name);

        if(obj === null)
            success = false;
        else {
            if(pwd == obj.password)
                success = true;
            else
                success = false;
        }

        return Promise.resolve(success);
    }

    protected Exists(object: iUser): boolean {
        const uName: string = object.username;

        for (const u of this._dict.values()) {
            let cName: string = u.username; 
            if(uName == cName)
                return true;
        }

        return false;
    }

    private GetByName(uName: string): iUser | null {
        for (const u of this._dict.values()) {
            let name = u.username;
            if(uName == name)
                return u;
        }

        return null;
    }
    
    CreateAdapter(): GenericAdapterInMemory<iUser> {
        return new UserAdapterInMemory();
    }

    constructor() {
        super();
    }
}
import { iUser } from "../../model/user";
import { iUserAdapter } from "../user";
import GenericAdapterInMemory from "./generic";

export default class UserAdapterInMemory extends GenericAdapterInMemory<iUser> implements iUserAdapter {
    
    Authenticate(name: string, pwd: string): Promise<{success: boolean, user: iUser | null}> {
        let success: boolean;

        const user: iUser | null = this.GetByName(name);

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

    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && ("username" in object && "password" in object);
    }
    
    CreateAdapter(): Promise<GenericAdapterInMemory<iUser>> {
        return Promise.resolve(new UserAdapterInMemory());
    }

    constructor() {
        super();
    }
}
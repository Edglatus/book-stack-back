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

    async CreateAdapter(): Promise<iUserAdapter> {
        return Promise.resolve(new UserAdapterInMemory());
    }

    constructor() {
        super();
    }
}
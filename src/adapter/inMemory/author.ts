import { iAuthor } from "../../model/author";
import iAdapter from "../adapter";
import GenericAdapterInMemory from "./generic";

export default class AuthorAdapterInMemory extends GenericAdapterInMemory<iAuthor> {
    protected Exists(object: iAuthor): boolean {
        const aName: string = object.name.toLocaleLowerCase();
        
        for (const u of this._dict.values()) {
            let fName: string = u.name.toLocaleLowerCase(); 
            if(aName == fName)
            return true;
        }
        
        return false;
    }

    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && ("name" in object && "birth_date" in object);
    }
    
    CreateAdapter(): Promise<GenericAdapterInMemory<iAuthor>> {
        return Promise.resolve(new AuthorAdapterInMemory());
    }

    constructor() {
        super();
    }
}
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
    
    constructor() {
        super();
    }
}
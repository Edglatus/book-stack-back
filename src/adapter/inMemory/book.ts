import { iBook } from "../../model/book";
import GenericAdapterInMemory from "./generic";

export default class BookAdapterInMemory extends GenericAdapterInMemory<iBook> {
    protected Exists(object: iBook): boolean {
        const isbn: string = object.isbn;

        for (const u of this._dict.values()) {
            let fISBN: string = u.isbn; 
            if(isbn == fISBN)
                return true;
        }

        return false;
    }

    isObjectOfType(object: any): boolean {
        return !(object === null || object === undefined) && ("title" in object && "isbn" in object && "cover_url" in object);
    }
    
    CreateAdapter(): Promise<GenericAdapterInMemory<iBook>> {
        return Promise.resolve(new BookAdapterInMemory());
    }

    constructor() {
        super();
    }
}
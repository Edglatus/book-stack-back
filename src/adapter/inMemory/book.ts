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
    
    CreateAdapter(): GenericAdapterInMemory<iBook> {
        return new BookAdapterInMemory();
    }

    constructor() {
        super();
    }
}
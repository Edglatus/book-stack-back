import iDomainObject from "../../model/domainObject";
import iAdapter from "../adapter";

export default abstract class GenericAdapterInMemory<T extends iDomainObject> implements iAdapter<T> {
    protected _dict : Map<string, T>;

    GetOne(id: string): Promise<T | null> {
        if(this._dict.has(id))
            return Promise.resolve(this._dict.get(id)) as Promise<T>;
        return Promise.resolve(null);
    }
    GetAll(): Promise<T[]> {
        let array: T[] = Array.from(this._dict.values());

        return Promise.resolve(array);
    }
    Create(object: T): Promise<boolean> {
        let success: boolean;

        if(!this.Exists(object)) {
            this._dict.set(object.id, object);
            success = true;
        }
        else {
            success = false;
        }

        return Promise.resolve(success);
    }
    Update(id: string, object: T): Promise<boolean> {
        let success: boolean;

        if(this.Exists(object)) {
            this._dict.set(object.id, object);
            success = true;
        }
        else {
            success = false;
        }

        return Promise.resolve(success);
    }
    Delete(id: string): Promise<boolean> {
        let success: boolean;

        if(this._dict.has(id)) {
            this._dict.delete(id);
            success = true;
        }
        else {
            success = false;
        }

        return Promise.resolve(success);
    }

    constructor() {
        this._dict = new Map<string, T>();
    }

    protected abstract Exists(object: T): boolean;

}
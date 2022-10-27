export default interface iAdapter<T> {
    GetOne(id: string): Promise<T | null>;
    GetAll(): Promise<T []>;
    Create(object: T): Promise<string>;
    Update(id: string, object: T): Promise<boolean>;
    Delete(id: string): Promise<boolean>;
}
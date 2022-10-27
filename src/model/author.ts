import iDomainObject from "./domainObject";

export interface iAuthor extends iDomainObject {
    name: string;
    birth_date: Date;
} 

export class Author implements iAuthor {
    public id: string;
    public name: string;
    public birth_date: Date;

    constructor(id: string = "", name: string, birth_date: Date) {
        this.id = id;
        this.name = name;
        this.birth_date = birth_date;
    }
}
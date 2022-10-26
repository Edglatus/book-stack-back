import iDomainObject from "./domainObject";

export interface iBook extends iDomainObject{
    title: string;
    description: string;
    isbn: string;
    author_id: string;
    cover_url: string;
    publishing_date: Date;
}

export class Book implements iBook {
    id: string;
    title: string;
    description: string;
    isbn: string = "";
    author_id: string;
    cover_url: string;
    publishing_date: Date;

    constructor(id: string, title: string, description: string, isbn: string, author_id: string, cover_url: string, publishing_date: Date) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.isbn = isbn;
        this.author_id = author_id;
        this.cover_url = cover_url;
        this.publishing_date = publishing_date;
    }
}
import iDomainObject from "./domainObject";

export interface iUser extends iDomainObject{
    email: string;
    password: string;
}

export class User implements iUser {
    id: string;
    email: string;
    password: string;
    

    constructor(id: string = "", uname: string, pwd: string) {
        this.id = id;
        this.email = uname;
        this.password = pwd;
    }
}
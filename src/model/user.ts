import iDomainObject from "./domainObject";

export interface iUser extends iDomainObject{
    username: string;
    password: string;
}

export class User implements iUser {
    id: string;
    username: string;
    password: string;
    

    constructor(id: string = "", uname: string, pwd: string) {
        this.id = id;
        this.username = uname;
        this.password = pwd;
    }
}
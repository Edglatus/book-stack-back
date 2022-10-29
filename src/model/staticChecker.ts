interface iChecker {
    hello(): any;
}

export default interface iStaticChecker {
    new(): iChecker;
    isObjectOfType(object: any): boolean;
}
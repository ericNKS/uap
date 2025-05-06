export default class User {
    public readonly id?: number;
    constructor(
        public name?: string,
        public email?: string,
        public password?: string,
        public rules?: Array<string>,
    ) {}
    
}
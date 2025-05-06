export default class CreateUserRequest {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public rules?: Array<string>,
    ){}
}
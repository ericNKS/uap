import { Controller, Get, Post} from "routing-controllers";
import { Postgres } from "../../../config/database/Postgres";
import UserRepository from "../Repository/UserRepository";

@Controller('/api')
export default class AuthController {
    @Get('/register')
    async ping() {
        const repo = new UserRepository(Postgres);

        return await repo.findByAll()
    }
}
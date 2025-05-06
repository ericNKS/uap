import { Controller, Get} from "routing-controllers";

@Controller('/api')
export default class AuthController {
    @Get('/login')
    ping() {
        return {ping: 'login'}
    }
}
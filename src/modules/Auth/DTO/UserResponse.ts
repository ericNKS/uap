import User from "../Entities/User";

export default class UserResponse {
    public static toJson(user: User): User {
        return {
            idUser: user.idUser,
            genuser: user.genuser,
            rulesuser: user.rulesuser,
            imgurluser: user.imgurluser,
            stsativouser: user.stsativouser
        } as User;
    }
}
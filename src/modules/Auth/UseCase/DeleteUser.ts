import IUserRepository from "../Interfaces/IUserRepository";
import ExceptionNotFound from "../Utils/ExceptionNotFound";

export default class DeleteUser {
    constructor(
        private repository: IUserRepository
    ) {}

    public async execute(userId: number): Promise<void> {

        try {
            const user = await this.repository.findById(userId);

            if(!user) {
                throw new ExceptionNotFound('User Not Found');
            }
            
            await this.repository.remove(user);
        } catch (error) {
            throw error;
        }
    }
}
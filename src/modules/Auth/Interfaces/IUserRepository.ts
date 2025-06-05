import User from "../Entities/User";

export default interface IUserRepository {
    createPaciente: (user: User) => Promise<User>,
    createEspecialista: (user: User) => Promise<User>,
    update: (user: User) => Promise<User>,
    updateImage: (user: User) => Promise<User>,
    updatePassword: (user: User) => Promise<User>,
    findByEmail: (email: string) => Promise<User | null>,
    activeByEmail: (user: User) => Promise<User>,
    findByCpfOrCnpjUser: (cpfOrCnpjUser: string) => Promise<User>,
    findById: (id: number) => Promise<User>,
    findByIdWithPassword: (id: number) => Promise<User>,
    remove: (user: User) => Promise<void>,
}
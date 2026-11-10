import { UserEntity } from "../entities/user.entity";
export interface IUserRepository {
    getCurrentUser(): Promise<UserEntity | null>;
}

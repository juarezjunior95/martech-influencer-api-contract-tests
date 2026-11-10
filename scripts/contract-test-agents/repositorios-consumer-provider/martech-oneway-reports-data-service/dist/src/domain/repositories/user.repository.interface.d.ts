import { UserEntity } from "@domain/entities/user.entity";
export interface IUserRepository {
    getCurrentUser(): Promise<UserEntity | null>;
}

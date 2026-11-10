import { IHeaderContextService } from "@common/interfaces/header-context.service.interface";
import { UserEntity } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
export declare class CurrentUserRepository implements IUserRepository {
    private readonly headerContextService;
    private readonly logger;
    private currentUser;
    constructor(headerContextService: IHeaderContextService);
    getCurrentUser(): Promise<UserEntity | null>;
    private resolveMockUser;
    private extractUserFromToken;
    private decodeJwt;
    private normalizeScopes;
}

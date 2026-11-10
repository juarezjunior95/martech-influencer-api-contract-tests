import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { UserEntity } from "../../domain/entities/user.entity";
import { IHeaderContextService } from "../../common/interfaces/header-context.service.interface";
export declare class CurrentUserRepository implements IUserRepository {
    private readonly headerContextService;
    private readonly logger;
    private currentUser;
    constructor(headerContextService: IHeaderContextService);
    getCurrentUser(): Promise<UserEntity | null>;
    private extractUserFromToken;
    private getAuthorizationToken;
    private decodeJwtToken;
    private extractScopes;
    private normalizeScopes;
    private extractCountry;
    private extractSupportedCountries;
}

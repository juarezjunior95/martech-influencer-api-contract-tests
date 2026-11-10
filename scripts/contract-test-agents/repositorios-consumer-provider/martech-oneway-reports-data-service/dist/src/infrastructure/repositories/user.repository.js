"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CurrentUserRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUserRepository = void 0;
const common_1 = require("@nestjs/common");
const jwt_decode_1 = require("jwt-decode");
const user_entity_1 = require("../../domain/entities/user.entity");
const mock_user_dev_1 = require("./__mocks__/mock-user.dev");
let CurrentUserRepository = CurrentUserRepository_1 = class CurrentUserRepository {
    constructor(headerContextService) {
        this.headerContextService = headerContextService;
        this.logger = new common_1.Logger(CurrentUserRepository_1.name);
        this.currentUser = undefined;
    }
    async getCurrentUser() {
        if (this.currentUser !== undefined) {
            return this.currentUser;
        }
        try {
            this.currentUser = this.resolveMockUser() ?? this.extractUserFromToken();
        }
        catch (error) {
            this.logger.error(`Error resolving current user: ${error.message}`);
            this.currentUser = null;
        }
        return this.currentUser;
    }
    resolveMockUser() {
        if (process.env.NODE_ENV !== "development") {
            return null;
        }
        if (process.env.MOCK_USER_OVERRIDE !== "true") {
            return null;
        }
        this.logger.warn(`MOCK USER ACTIVE — overriding JWT (scopes=[${mock_user_dev_1.mockUser.scopes.join(", ")}], supportedCountries=[${mock_user_dev_1.mockUser.supportedCountries.join(", ")}])`);
        return user_entity_1.UserEntity.create({
            scopes: [...mock_user_dev_1.mockUser.scopes],
            country: mock_user_dev_1.mockUser.country ?? null,
            supportedCountries: [...mock_user_dev_1.mockUser.supportedCountries],
        });
    }
    extractUserFromToken() {
        const token = this.headerContextService.getHeaderContext()?.authorization;
        if (!token) {
            return null;
        }
        const decoded = this.decodeJwt(token);
        if (!decoded) {
            return null;
        }
        return user_entity_1.UserEntity.create({
            scopes: this.normalizeScopes(decoded.scopes),
            country: decoded.country ?? null,
            supportedCountries: Array.isArray(decoded.supportedCountries)
                ? decoded.supportedCountries
                : [],
        });
    }
    decodeJwt(token) {
        try {
            const cleanToken = token.replace(/^Bearer\s+/i, "");
            const decoded = (0, jwt_decode_1.jwtDecode)(cleanToken);
            if (!decoded || typeof decoded !== "object") {
                this.logger.warn("Invalid JWT token format");
                return null;
            }
            return decoded;
        }
        catch (error) {
            this.logger.error(`Error decoding JWT token: ${error.message}`);
            return null;
        }
    }
    normalizeScopes(scopes) {
        if (Array.isArray(scopes)) {
            return scopes.filter(Boolean);
        }
        return scopes ? [scopes].filter(Boolean) : [];
    }
};
exports.CurrentUserRepository = CurrentUserRepository;
exports.CurrentUserRepository = CurrentUserRepository = CurrentUserRepository_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)("IHeaderContextService")),
    __metadata("design:paramtypes", [Object])
], CurrentUserRepository);
//# sourceMappingURL=user.repository.js.map
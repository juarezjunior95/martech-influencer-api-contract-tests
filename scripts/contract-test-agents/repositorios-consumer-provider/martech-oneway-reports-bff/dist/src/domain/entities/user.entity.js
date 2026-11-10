"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(scopes, country, supportedCountries) {
        this.scopes = scopes;
        this.country = country;
        this.supportedCountries = supportedCountries;
    }
    static create(props) {
        return new UserEntity(props.scopes, props.country, props.supportedCountries);
    }
    getScopes(sorted) {
        const filtered = this.scopes.filter((scope) => scope.startsWith("OneWayReports."));
        if (!sorted) {
            return filtered;
        }
        return [...filtered].sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
        });
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map
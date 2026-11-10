"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUser = void 0;
const scopes_1 = require("../../../domain/entities/scopes");
exports.mockUser = {
    country: "BR",
    scopes: [
        scopes_1.VIEWER_SCOPES.GLOBAL,
        scopes_1.VIEWER_SCOPES.COUNTRY,
        scopes_1.VIEWER_SCOPES.ZONE.APAC,
    ],
    supportedCountries: [],
};
//# sourceMappingURL=mock-user.dev.js.map
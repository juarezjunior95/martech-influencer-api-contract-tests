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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderContextInterceptor = void 0;
const common_1 = require("@nestjs/common");
let HeaderContextInterceptor = class HeaderContextInterceptor {
    constructor(headerContextService) {
        this.headerContextService = headerContextService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers;
        const requestTraceId = headers?.requesttraceid || headers?.requestTraceId;
        const country = headers?.country;
        const headerContext = {
            authorization: headers?.authorization,
            requestTraceId,
            country,
            accept: headers?.accept,
            acceptLanguage: headers?.["accept-language"] || "en",
            contentType: headers?.["content-type"],
        };
        this.headerContextService.setHeaderContext(headerContext);
        return next.handle();
    }
};
exports.HeaderContextInterceptor = HeaderContextInterceptor;
exports.HeaderContextInterceptor = HeaderContextInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("IHeaderContextService")),
    __metadata("design:paramtypes", [Object])
], HeaderContextInterceptor);
//# sourceMappingURL=header-context.interceptor.js.map
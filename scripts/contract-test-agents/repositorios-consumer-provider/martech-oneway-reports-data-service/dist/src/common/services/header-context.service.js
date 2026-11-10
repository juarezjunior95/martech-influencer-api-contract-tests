"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderContextService = void 0;
const common_1 = require("@nestjs/common");
const winston_context_format_1 = require("../utils/winston-context.format");
let HeaderContextService = class HeaderContextService {
    constructor() {
        this.headerContext = null;
    }
    setHeaderContext(context) {
        this.headerContext = context;
        winston_context_format_1.requestContextStorage.enterWith(context);
    }
    getHeaderContext() {
        return this.headerContext;
    }
    getRequestTraceId() {
        return this.headerContext?.requestTraceId;
    }
    getCountry() {
        return this.headerContext?.country;
    }
};
exports.HeaderContextService = HeaderContextService;
exports.HeaderContextService = HeaderContextService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST })
], HeaderContextService);
//# sourceMappingURL=header-context.service.js.map
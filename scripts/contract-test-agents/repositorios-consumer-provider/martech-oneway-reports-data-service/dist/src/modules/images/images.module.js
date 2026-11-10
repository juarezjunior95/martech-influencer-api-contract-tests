"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesModule = void 0;
const common_1 = require("@nestjs/common");
const aliases_loader_1 = require("./aliases.loader");
const images_controller_1 = require("./images.controller");
const images_service_1 = require("./images.service");
const images_alias_tokens_1 = require("./images-alias-tokens");
let ImagesModule = class ImagesModule {
};
exports.ImagesModule = ImagesModule;
exports.ImagesModule = ImagesModule = __decorate([
    (0, common_1.Module)({
        controllers: [images_controller_1.ImagesController],
        providers: [
            {
                provide: "IMAGE_ALIAS_MAPS_BOOT",
                useFactory: () => (0, aliases_loader_1.loadImageAliasMapsFromJson)(),
            },
            {
                provide: images_alias_tokens_1.BRAND_ALIAS_TO_CANONICAL,
                inject: ["IMAGE_ALIAS_MAPS_BOOT"],
                useFactory: (boot) => boot.brandAliasToCanonical,
            },
            {
                provide: images_alias_tokens_1.BRAND_CANONICAL_TO_ALIASES,
                inject: ["IMAGE_ALIAS_MAPS_BOOT"],
                useFactory: (boot) => boot.brandCanonicalToAliases,
            },
            {
                provide: images_alias_tokens_1.COUNTRY_ALIAS_TO_CANONICAL,
                inject: ["IMAGE_ALIAS_MAPS_BOOT"],
                useFactory: (boot) => boot.countryAliasToCanonical,
            },
            {
                provide: images_alias_tokens_1.COUNTRY_CANONICAL_TO_ALIASES,
                inject: ["IMAGE_ALIAS_MAPS_BOOT"],
                useFactory: (boot) => boot.countryCanonicalToAliases,
            },
            images_service_1.ImagesService,
        ],
    })
], ImagesModule);
//# sourceMappingURL=images.module.js.map
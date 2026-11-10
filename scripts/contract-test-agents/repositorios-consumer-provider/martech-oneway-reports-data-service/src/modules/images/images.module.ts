import { Module } from "@nestjs/common";
import { loadImageAliasMapsFromJson } from "./aliases.loader";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";
import {
  BRAND_ALIAS_TO_CANONICAL,
  BRAND_CANONICAL_TO_ALIASES,
  COUNTRY_ALIAS_TO_CANONICAL,
  COUNTRY_CANONICAL_TO_ALIASES,
} from "./images-alias-tokens";

@Module({
  controllers: [ImagesController],
  providers: [
    {
      provide: "IMAGE_ALIAS_MAPS_BOOT",
      useFactory: () => loadImageAliasMapsFromJson(),
    },
    {
      provide: BRAND_ALIAS_TO_CANONICAL,
      inject: ["IMAGE_ALIAS_MAPS_BOOT"],
      useFactory: (boot: ReturnType<typeof loadImageAliasMapsFromJson>) =>
        boot.brandAliasToCanonical,
    },
    {
      provide: BRAND_CANONICAL_TO_ALIASES,
      inject: ["IMAGE_ALIAS_MAPS_BOOT"],
      useFactory: (boot: ReturnType<typeof loadImageAliasMapsFromJson>) =>
        boot.brandCanonicalToAliases,
    },
    {
      provide: COUNTRY_ALIAS_TO_CANONICAL,
      inject: ["IMAGE_ALIAS_MAPS_BOOT"],
      useFactory: (boot: ReturnType<typeof loadImageAliasMapsFromJson>) =>
        boot.countryAliasToCanonical,
    },
    {
      provide: COUNTRY_CANONICAL_TO_ALIASES,
      inject: ["IMAGE_ALIAS_MAPS_BOOT"],
      useFactory: (boot: ReturnType<typeof loadImageAliasMapsFromJson>) =>
        boot.countryCanonicalToAliases,
    },
    ImagesService,
  ],
})
export class ImagesModule {}

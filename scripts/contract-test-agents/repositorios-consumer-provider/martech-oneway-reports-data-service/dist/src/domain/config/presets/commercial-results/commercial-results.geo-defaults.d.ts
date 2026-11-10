import type { ZoneCountryDefaults } from "@domain/config/presets/common/zone-country-defaults";
import { UserEntity } from "@domain/entities/user.entity";
export declare function resolveCommercialGeoDefault(user: UserEntity | undefined, regionalEffective: string[], availableCountryIds: ReadonlySet<string>): ZoneCountryDefaults | null;

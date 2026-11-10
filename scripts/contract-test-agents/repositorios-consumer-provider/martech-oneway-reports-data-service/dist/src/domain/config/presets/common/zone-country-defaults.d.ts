import { UserEntity } from "@domain/entities/user.entity";
export interface ZoneCountryEntry {
    value: string;
    label: string;
    quick_filter_label: string;
}
export interface ZoneCountryDefaults {
    zone: ZoneCountryEntry;
    country: ZoneCountryEntry;
}
export declare function computeZoneCountryDefaults(effective: string[], user: UserEntity | undefined, availableCountryIds?: ReadonlySet<string>): ZoneCountryDefaults;

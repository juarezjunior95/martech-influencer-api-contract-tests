import { UserEntity } from "@domain/entities/user.entity";
export interface EffectiveDefaultEntry {
    value: string;
    label: string;
    quick_filter_label: string;
}
export interface EffectiveDefaults {
    zone: EffectiveDefaultEntry;
    country: EffectiveDefaultEntry;
}
export declare function computeEffectiveDefaults(effective: string[], user: UserEntity | undefined): EffectiveDefaults;

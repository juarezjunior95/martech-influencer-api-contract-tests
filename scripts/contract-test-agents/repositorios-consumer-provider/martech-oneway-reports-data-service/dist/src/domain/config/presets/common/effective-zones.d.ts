import { UserEntity } from "@domain/entities/user.entity";
export interface EffectiveZones {
    effective: string[];
    includesGlobal: boolean;
}
export interface ComputeEffectiveZonesOptions {
    skipReachabilityFilter?: boolean;
}
export declare function computeEffectiveZones(zoneScope: string[] | undefined, user: UserEntity | undefined, options?: ComputeEffectiveZonesOptions): EffectiveZones;

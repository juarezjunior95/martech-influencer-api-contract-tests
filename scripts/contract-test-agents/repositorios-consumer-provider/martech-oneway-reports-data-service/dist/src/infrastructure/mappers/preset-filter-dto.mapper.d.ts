import { PresetFilterDto } from "@infrastructure/controllers/dto/preset-filter.dto";
import { Filter } from "@domain/entities/common/base-config.entity";
export declare class PresetFilterDtoMapper {
    static toFilters(dto: PresetFilterDto | undefined): Filter[];
}

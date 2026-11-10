import { PresetFilterDto } from "../controllers/dto/preset-filter.dto";
import { PresetFilter } from "../../domain/entities/preset.entity";
export declare class PresetFilterDtoMapper {
    static toFilters(dto: PresetFilterDto | undefined): PresetFilter[];
}

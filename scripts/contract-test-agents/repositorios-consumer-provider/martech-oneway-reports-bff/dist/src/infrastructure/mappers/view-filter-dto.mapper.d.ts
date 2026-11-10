import { ViewFilterDto } from "../controllers/dto/view-filter.dto";
import { FilterSet } from "../../domain/entities/view.entity";
export declare class ViewFilterDtoMapper {
    static toFilterSets(filterDto: ViewFilterDto): FilterSet[];
}

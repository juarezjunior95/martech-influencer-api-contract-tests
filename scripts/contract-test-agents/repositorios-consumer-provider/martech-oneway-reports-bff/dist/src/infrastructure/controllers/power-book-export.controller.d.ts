import { PowerBookExportDto } from "./dto/power-book-export.dto";
import { ViewFilterDto } from "./dto/view-filter.dto";
import { ProcessPowerBookExportUseCase } from "../../application/usecases/process-power-book-export.usecase";
import { ProcessCountriesExportUseCase } from "../../application/usecases/process-countries-export.usecase";
import { CountriesExportDto } from "./dto/countries-export.dto";
export declare class PowerBookExportController {
    private readonly exportUseCase;
    private readonly countriesExportUseCase;
    constructor(exportUseCase: ProcessPowerBookExportUseCase, countriesExportUseCase: ProcessCountriesExportUseCase);
    exportGroup(body: PowerBookExportDto, filters: ViewFilterDto): Promise<Record<string, import("@application/usecases/process-power-book-export.usecase").CategoryExportData>>;
    exportCountries(body: CountriesExportDto, filters: ViewFilterDto): Promise<import("@application/usecases/process-countries-export.usecase").CountriesExportResult>;
}

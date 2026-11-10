import { FormatterContext, IFormatterRepository } from "../../domain/repositories/formatter.repository.interface";
import { DataSource } from "../../domain/entities/view.entity";
import { EnvironmentConfigService } from "../../common/config/environment-config.service";
export declare class FormatterRepository implements IFormatterRepository {
    private readonly environmentConfig;
    private readonly logger;
    private readonly cache;
    private readonly formattersPath;
    constructor(environmentConfig: EnvironmentConfigService);
    format(formatter: string, data: DataSource[], context?: FormatterContext): Promise<any>;
    private loadJsonataExpression;
    private createDatasourcesObject;
    private createFiltersObject;
}

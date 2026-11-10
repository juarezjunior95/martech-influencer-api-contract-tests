import { EnvironmentConfigService } from "../../common/config/environment-config.service";
import { IPresetFormatterRepository } from "../../domain/repositories/preset-formatter.repository.interface";
import { PresetData } from "../../domain/entities/preset.entity";
export declare class PresetFormatterRepository implements IPresetFormatterRepository {
    private readonly environmentConfig;
    private readonly logger;
    private readonly cache;
    private readonly formattersPath;
    constructor(environmentConfig: EnvironmentConfigService);
    format(formatter: string, data: PresetData): Promise<PresetData>;
    private loadExpression;
}

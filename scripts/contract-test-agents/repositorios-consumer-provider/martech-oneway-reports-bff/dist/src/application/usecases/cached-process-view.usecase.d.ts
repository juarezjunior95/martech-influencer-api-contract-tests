import { IProcessViewUseCase } from "../interfaces/process-view.usecase.interface";
import { IViewCacheRepository } from "../../domain/repositories/view-cache.repository.interface";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { EnvironmentConfigService } from "../../common/config/environment-config.service";
import { FilterSet, View, ProcessedViewResult } from "../../domain/entities/view.entity";
export declare class CachedProcessViewUseCase implements IProcessViewUseCase {
    private readonly processViewUseCase;
    private readonly viewCacheRepository;
    private readonly userRepository;
    private readonly environmentConfig;
    private readonly logger;
    constructor(processViewUseCase: IProcessViewUseCase, viewCacheRepository: IViewCacheRepository, userRepository: IUserRepository, environmentConfig: EnvironmentConfigService);
    execute(view: string, filterSets?: FilterSet[]): Promise<ProcessedViewResult>;
    private hasComponentErrors;
    createViewEntity(view: string, filterSets?: FilterSet[]): Promise<View>;
    processViewEntity(viewEntity: View): Promise<ProcessedViewResult>;
}

import { ViewFilterDto } from "./dto/view-filter.dto";
import { ClearCacheDto } from "./dto/clear-cache.dto";
import { IProcessViewUseCase } from "../../application/interfaces/process-view.usecase.interface";
import { ClearCacheUseCase } from "../../application/usecases/clear-cache.usecase";
export declare class ViewController {
    private readonly processViewUseCase;
    private readonly clearCacheUseCase;
    private readonly logger;
    constructor(processViewUseCase: IProcessViewUseCase, clearCacheUseCase: ClearCacheUseCase);
    clearCache(clearCacheDto: ClearCacheDto): Promise<{
        deletedCount: number;
    }>;
    getView(view: string, filters: ViewFilterDto): Promise<import("../../domain/entities/view.entity").ProcessedViewResult | {
        compressed: boolean;
        data: string;
    }>;
}

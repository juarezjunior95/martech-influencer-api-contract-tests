import { IProcessViewUseCase } from "../interfaces/process-view.usecase.interface";
import { IViewConfigRepository } from "../../domain/repositories/view-config.repository.interface";
import { IDataRepository } from "../../domain/repositories/datasource.repository.interface";
import { IFormatterRepository } from "../../domain/repositories/formatter.repository.interface";
import { View, ProcessedViewResult, FilterSet } from "../../domain/entities/view.entity";
export declare class ProcessViewUseCase implements IProcessViewUseCase {
    private readonly viewConfigRepository;
    private readonly dataRepository;
    private readonly formatterRepository;
    private readonly logger;
    constructor(viewConfigRepository: IViewConfigRepository, dataRepository: IDataRepository, formatterRepository: IFormatterRepository);
    execute(view: string, filterSets?: FilterSet[]): Promise<ProcessedViewResult>;
    createViewEntity(view: string, filterSets?: FilterSet[]): Promise<View>;
    processViewEntity(viewEntity: View): Promise<ProcessedViewResult>;
    private processComponents;
    private processComponentData;
    private loadComponentDatasources;
    private applyComponentFormatter;
}

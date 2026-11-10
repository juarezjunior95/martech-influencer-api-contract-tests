import { FilterSet, View, ProcessedViewResult } from "../../domain/entities/view.entity";
export interface IProcessViewUseCase {
    execute(view: string, filterSets?: FilterSet[]): Promise<ProcessedViewResult>;
    createViewEntity(view: string, filterSets?: FilterSet[]): Promise<View>;
    processViewEntity(viewEntity: View): Promise<ProcessedViewResult>;
}

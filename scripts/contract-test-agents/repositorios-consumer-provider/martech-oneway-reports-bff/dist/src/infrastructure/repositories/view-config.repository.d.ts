import { IViewConfigRepository } from "../../domain/repositories/view-config.repository.interface";
import { ViewConfig } from "../../domain/entities/view.entity";
export declare class ViewConfigRepository implements IViewConfigRepository {
    private readonly logger;
    private readonly require;
    private readonly viewsPath;
    getByName(viewName: string): Promise<ViewConfig | null>;
    private formatViewName;
}

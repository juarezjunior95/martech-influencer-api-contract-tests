import { ViewConfig } from "../entities/view.entity";
export interface IViewConfigRepository {
    getByName(viewName: string): Promise<ViewConfig | null>;
}

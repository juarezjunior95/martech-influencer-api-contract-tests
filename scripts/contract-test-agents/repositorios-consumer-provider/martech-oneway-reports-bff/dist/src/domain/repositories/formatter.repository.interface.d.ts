import { DataSource, Filter } from "../entities/view.entity";
export interface FormatterContext {
    filters?: Filter[];
}
export interface IFormatterRepository {
    format(formatter: string, data: DataSource[], context?: FormatterContext): Promise<any>;
}

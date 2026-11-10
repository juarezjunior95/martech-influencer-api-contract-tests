import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { AxiosResponse } from "axios";
import { EnvironmentConfigService } from "../../common/config/environment-config.service";
import { IHeaderContextService } from "../../common/interfaces/header-context.service.interface";
export declare class DataServiceClient {
    private readonly httpService;
    private readonly environmentConfigService;
    private readonly headerContextService;
    private readonly logger;
    private readonly baseUrl;
    constructor(httpService: HttpService, environmentConfigService: EnvironmentConfigService, headerContextService: IHeaderContextService);
    private getHeaders;
    get<T = any>(endpoint: string, params?: Record<string, any>): Observable<AxiosResponse<T>>;
}

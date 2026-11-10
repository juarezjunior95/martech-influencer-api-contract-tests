import { DataServiceClient } from "../../infrastructure/services/data-service.client";
export declare class ImagesProxyService {
    private readonly dataServiceClient;
    private readonly logger;
    constructor(dataServiceClient: DataServiceClient);
    proxyBrand(query: {
        name?: string;
        format: "table" | "square";
        brand_family?: string;
    }): Promise<any>;
    proxyCountry(query: {
        name?: string;
        format: "icon" | "waving";
    }): Promise<any>;
    private rethrowUpstream;
}

import { ConfigService } from "@nestjs/config";
export declare class EnvironmentConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get dataService(): {
        baseUrl: string;
    };
    get redis(): {
        host: string;
        port: number;
        password: string;
    };
    get viewCache(): {
        enabled: boolean;
    };
    get presetCache(): {
        enabled: boolean;
    };
    get pageCache(): {
        enabled: boolean;
    };
    get env(): string;
}

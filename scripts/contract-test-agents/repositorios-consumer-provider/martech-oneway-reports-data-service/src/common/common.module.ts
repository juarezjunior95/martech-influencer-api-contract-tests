import { Module } from "@nestjs/common";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { HeaderContextService } from "@common/services/header-context.service";
import { FileLoaderService } from "@common/services/file-loader.service";

@Module({
  imports: [],
  providers: [
    EnvironmentConfigService,
    FileLoaderService,
    {
      provide: "IHeaderContextService",
      useClass: HeaderContextService,
    },
  ],
  exports: [
    EnvironmentConfigService,
    FileLoaderService,
    "IHeaderContextService",
  ],
})
export class CommonModule {}

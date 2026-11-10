import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { EnvironmentConfigService } from "./config/environment-config.service";
import { HeaderContextService } from "./services/header-context.service";

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: "IEnvironmentConfigService",
      useClass: EnvironmentConfigService,
    },
    {
      provide: "IHeaderContextService",
      useClass: HeaderContextService,
    },
  ],
  exports: [HttpModule, "IEnvironmentConfigService", "IHeaderContextService"],
})
export class CommonModule {}

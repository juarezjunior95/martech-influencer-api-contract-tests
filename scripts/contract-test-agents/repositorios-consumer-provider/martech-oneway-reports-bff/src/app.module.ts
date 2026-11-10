import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { CommonModule } from "@common/common.module";
import { HealthModule } from "@infrastructure/modules/health-check.module";
import { ViewModule } from "@infrastructure/modules/view.module";
import { PresetModule } from "@infrastructure/modules/preset.module";
import { ImagesModule } from "@modules/images/images.module";
import { winstonContextFormat } from "@common/utils/winston-context.format";

@Global()
@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || "info",
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winstonContextFormat(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    CommonModule,
    HealthModule,
    ViewModule,
    PresetModule,
    ImagesModule,
  ],
})
export class AppModule {}

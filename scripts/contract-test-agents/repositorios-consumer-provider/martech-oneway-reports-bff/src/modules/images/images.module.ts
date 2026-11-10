import { Module } from "@nestjs/common";
import { CommonModule } from "@common/common.module";
import { DataServiceClient } from "@infrastructure/services/data-service.client";
import { ImagesController } from "./images.controller";
import { ImagesProxyService } from "./images-proxy.service";

@Module({
  imports: [CommonModule],
  controllers: [ImagesController],
  providers: [DataServiceClient, ImagesProxyService],
})
export class ImagesModule {}

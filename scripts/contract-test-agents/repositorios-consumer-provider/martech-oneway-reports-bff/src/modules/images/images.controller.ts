import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";
import { ImagesBrandQueryDto } from "./dto/images-brand-query.dto";
import { ImagesCountryQueryDto } from "./dto/images-country-query.dto";
import { ImagesProxyService } from "./images-proxy.service";

@ApiTags("images")
@Controller("images")
@UseInterceptors(HeaderContextInterceptor)
export class ImagesController {
  constructor(private readonly imagesProxyService: ImagesProxyService) {}

  @Get("brand")
  @ApiOperation({
    operationId: "ProxyResolveBrandImage",
    summary: "Resolve CDN URL for a brand image (proxied to data service)",
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "format", required: false, enum: ["table", "square"] })
  @ApiQuery({ name: "brand_family", required: false })
  @ApiResponse({ status: 200, description: "{ url, matched, image_variants }" })
  getBrand(@Query() query: ImagesBrandQueryDto) {
    return this.imagesProxyService.proxyBrand({
      name: query.name,
      format: query.format,
      brand_family: query.brand_family,
    });
  }

  @Get("country")
  @ApiOperation({
    operationId: "ProxyResolveCountryImage",
    summary: "Resolve CDN URL for a country flag (proxied to data service)",
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "format", required: false, enum: ["icon", "waving"] })
  @ApiResponse({ status: 200, description: "{ url, matched }" })
  getCountry(@Query() query: ImagesCountryQueryDto) {
    return this.imagesProxyService.proxyCountry({
      name: query.name,
      format: query.format,
    });
  }
}

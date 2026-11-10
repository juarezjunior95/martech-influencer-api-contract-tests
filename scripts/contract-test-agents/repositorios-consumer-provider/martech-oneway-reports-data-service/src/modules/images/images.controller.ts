import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ImagesService } from "./images.service";
import { ImagesBrandQueryDto } from "./dto/images-brand-query.dto";
import { ImagesCountryQueryDto } from "./dto/images-country-query.dto";

@ApiTags("images")
@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get("brand")
  @ApiOperation({
    operationId: "ResolveBrandImage",
    summary: "Resolve CDN URL for a brand image (single)",
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "format", required: false, enum: ["table", "square"] })
  @ApiQuery({ name: "brand_family", required: false })
  @ApiResponse({ status: 200, description: "{ url, matched, image_variants }" })
  getBrand(@Query() query: ImagesBrandQueryDto) {
    return this.imagesService.resolveBrand(
      query.name,
      query.format ?? "square",
      query.brand_family,
    );
  }

  @Get("country")
  @ApiOperation({
    operationId: "ResolveCountryImage",
    summary: "Resolve CDN URL for a country flag (single)",
  })
  @ApiQuery({ name: "name", required: false })
  @ApiQuery({ name: "format", required: false, enum: ["icon", "waving"] })
  @ApiResponse({ status: 200, description: "{ url, matched }" })
  getCountry(@Query() query: ImagesCountryQueryDto) {
    return this.imagesService.resolveCountry(
      query.name,
      query.format ?? "icon",
    );
  }
}

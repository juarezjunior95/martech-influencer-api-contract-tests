import {
  Controller,
  HttpStatus,
  Get,
  Delete,
  Param,
  Query,
  Body,
  Logger,
  Inject,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiParam,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { ViewFilterDto } from "./dto/view-filter.dto";
import { ClearCacheDto } from "./dto/clear-cache.dto";
import { ViewFilterDtoMapper } from "@infrastructure/mappers/view-filter-dto.mapper";
import { IProcessViewUseCase } from "@application/interfaces/process-view.usecase.interface";
import { ClearCacheUseCase } from "@application/usecases/clear-cache.usecase";
import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";
import { generateViewsDescription } from "@common/utils/view-list.util";

@ApiTags("views")
@Controller("views")
@UseInterceptors(HeaderContextInterceptor)
export class ViewController {
  private readonly logger = new Logger(ViewController.name);

  constructor(
    @Inject("ICachedProcessViewUseCase")
    private readonly processViewUseCase: IProcessViewUseCase,
    @Inject("ClearCacheUseCase")
    private readonly clearCacheUseCase: ClearCacheUseCase,
  ) {}

  @Delete("cache")
  @ApiOperation({
    operationId: "ClearViewCache",
    summary: "Clear view cache by tags",
    description: "Invalidates cache entries associated with the provided tags",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cache cleared successfully",
    schema: {
      type: "object",
      properties: {
        deletedCount: {
          type: "number",
          description: "Number of cache keys deleted",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid request body or missing tags",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async clearCache(@Body() clearCacheDto: ClearCacheDto) {
    return await this.clearCacheUseCase.execute(clearCacheDto.tags);
  }

  @Get(":view")
  @ApiOperation({
    operationId: "GetView",
    summary: "Get view data",
    description: `Retrieves data for a specific view with optional filters.\n\n${generateViewsDescription()}`,
  })
  @ApiParam({
    name: "view",
    description: `Name of the view to retrieve. Use the view name from the folder structure above (e.g., \`portfolio-brand_brand-power-book_overview_power-book-overview\`).`,
    example: "example",
  })
  @ApiQuery({
    name: "filter",
    required: false,
    description:
      "Dynamic filter object with nested keys. Use filter[paramName]=value or filter[group][paramName]=value",
    schema: {
      type: "object",
      example: {
        country: "BRA",
        filterGroup: {
          country: "ARG",
          brand: "Corona",
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "View components retrieved successfully",
    schema: {
      type: "object",
      properties: {
        view: { type: "string" },
        components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              data: { type: "object" },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid view parameters",
  })
  @ApiNotFoundResponse({
    description: "View not found",
  })
  @ApiUnprocessableEntityResponse({
    description: "Request was correct, but view is unprocessable",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async getView(@Param("view") view: string, @Query() filters: ViewFilterDto) {
    // Convert filters to FilterSets using mapper
    const filterSets = ViewFilterDtoMapper.toFilterSets(filters);

    return await this.processViewUseCase.execute(view, filterSets);
  }
}

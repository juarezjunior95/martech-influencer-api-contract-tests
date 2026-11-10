import {
  Controller,
  Get,
  Param,
  Query,
  Logger,
  Inject,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { FetchDataSourceUseCase } from "@application/usecases/fetch-datasource.usecase";
import { DataSourceFilterDto } from "./dto/datasource-filter.dto";
import { DataSourceFilterDtoMapper } from "@infrastructure/mappers/datasource-filter-dto.mapper";
import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";
import { generateDatasourcesDescription } from "@common/utils/datasource-list.util";

/**
 * DataSource Controller
 * Handles HTTP requests for datasource data
 */
@ApiTags("datasources")
@Controller("datasources")
@UseInterceptors(HeaderContextInterceptor)
export class DataSourceController {
  private readonly logger = new Logger(DataSourceController.name);

  constructor(
    @Inject("FetchDataSourceUseCase")
    private readonly fetchDataSourceUseCase: FetchDataSourceUseCase,
  ) {}

  @Get(":name")
  @ApiOperation({
    operationId: "GetDataSource",
    summary: "Get datasource data",
    description:
      "Retrieves data from a specific datasource with optional filters.\n\n" +
      generateDatasourcesDescription(),
  })
  @ApiQuery({
    name: "filter",
    required: false,
    description:
      "Dynamic filter object with single level keys. Use filter[paramName]=value",
    schema: {
      type: "object",
      example: {
        country: "BRA",
        brand: "Corona",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Datasource data retrieved successfully",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid datasource parameters",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Datasource not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async getDataSource(
    @Param("name") name: string,
    @Query() filters: DataSourceFilterDto,
  ) {
    const data = await this.fetchDataSourceUseCase.execute({
      dataSourceName: name,
      filters: DataSourceFilterDtoMapper.toFilters(filters),
    });

    return {
      name,
      data,
    };
  }
}

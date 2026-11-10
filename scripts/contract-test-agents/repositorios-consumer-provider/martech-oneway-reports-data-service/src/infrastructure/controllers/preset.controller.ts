import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";
import { FetchPresetUseCase } from "@application/usecases/fetch-preset.usecase";
import { PresetFilterDto } from "@infrastructure/controllers/dto/preset-filter.dto";
import { PresetFilterDtoMapper } from "@infrastructure/mappers/preset-filter-dto.mapper";
import { generateDatasourcesDescription } from "@common/utils/datasource-list.util";

@ApiTags("presets")
@Controller("presets")
@UseInterceptors(HeaderContextInterceptor)
export class PresetController {
  private readonly logger = new Logger(PresetController.name);

  constructor(
    @Inject("FetchPresetUseCase")
    private readonly fetchPresetUseCase: FetchPresetUseCase,
  ) {}

  @Get(":name")
  @ApiOperation({
    operationId: "GetPreset",
    summary: "Get preset data",
    description:
      "Retrieves filters and configs for a specific page/context.\n\n" +
      generateDatasourcesDescription(),
  })
  @ApiQuery({
    name: "<namespace>",
    required: false,
    description:
      "Legacy-style namespaced filters. Use `<namespace>[<name>]=<value>` " +
      "(for example `years[no_default]=true`, `brand[include_global]=false`, " +
      "`brand[countries]=BRA,ARG`). The outer key selects the preset filter " +
      "the override applies to.",
    schema: {
      type: "object",
      example: {
        years: { no_default: true },
        brand: { include_global: false, countries: "BRA,ARG" },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Preset data retrieved successfully",
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
    description: "Invalid Preset parameters",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Preset not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async getPreset(
    @Param("name") name: string,
    @Query() filters: PresetFilterDto,
  ) {
    const data = await this.fetchPresetUseCase.execute({
      presetName: name,
      filters: PresetFilterDtoMapper.toFilters(filters),
    });

    return {
      name,
      data,
    };
  }
}

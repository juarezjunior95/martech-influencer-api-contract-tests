import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PresetFilterDto } from "./dto/preset-filter.dto";
import { PresetFilterDtoMapper } from "@infrastructure/mappers/preset-filter-dto.mapper";
import { HeaderContextInterceptor } from "@common/interceptors/header-context.interceptor";
import { IProcessPresetUseCase } from "@application/interfaces/process-preset.usecase.interface";
import { CACHED_PROCESS_PRESET_USE_CASE } from "@application/usecases/tokens";
import { PresetNotFoundError } from "@domain/exceptions/preset-not-found.error";
import { InvalidPresetConfigError } from "@domain/exceptions/invalid-preset-config.error";
import { generatePresetsDescription } from "@common/utils/preset-list.util";

@ApiTags("presets")
@Controller("presets")
@UseInterceptors(HeaderContextInterceptor)
export class PresetController {
  private readonly logger = new Logger(PresetController.name);

  constructor(
    @Inject(CACHED_PROCESS_PRESET_USE_CASE)
    private readonly processPresetUseCase: IProcessPresetUseCase,
  ) {}

  @Get(":preset")
  @ApiOperation({
    operationId: "GetPreset",
    summary: "Get preset data",
    description:
      "Retrieves filter + config metadata for a specific page/context. " +
      "Country options are automatically scoped to the caller's JWT supportedCountries." +
      `\n\n${generatePresetsDescription()}`,
  })
  @ApiParam({
    name: "preset",
    description:
      "Name of the preset. Use the preset name from the folder structure above (e.g. `brands` or `value-creation_growth-league`).",
    example: "brands",
  })
  @ApiQuery({
    name: "<namespace>",
    required: false,
    description:
      "Legacy-style namespaced filter overrides. Use " +
      "`<namespace>[<name>]=<value>` (e.g. `years[no_default]=true`, " +
      "`brand[include_global]=false`, `brand[countries]=BRA,ARG`). The " +
      "outer key selects the preset filter the override applies to.",
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
    description: "Preset retrieved successfully",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        data: { type: "object", additionalProperties: true },
      },
    },
  })
  @ApiBadRequestResponse({ description: "Invalid preset parameters" })
  @ApiNotFoundResponse({ description: "Preset not found" })
  @ApiInternalServerErrorResponse({ description: "Internal server error" })
  async getPreset(
    @Param("preset") preset: string,
    @Query() filters: PresetFilterDto,
  ) {
    try {
      const filterList = PresetFilterDtoMapper.toFilters(filters);
      return await this.processPresetUseCase.execute(preset, filterList);
    } catch (error) {
      if (error instanceof PresetNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidPresetConfigError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}

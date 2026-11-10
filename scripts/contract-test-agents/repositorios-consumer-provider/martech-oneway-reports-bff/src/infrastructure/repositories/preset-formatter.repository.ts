import { Inject, Injectable, Logger } from "@nestjs/common";
import { access, readFile } from "fs/promises";
import * as path from "path";
import jsonata from "jsonata";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { IPresetFormatterRepository } from "@domain/repositories/preset-formatter.repository.interface";
import { PresetData } from "@domain/entities/preset.entity";
import { registerHelpers } from "@infrastructure/repositories/helpers";

/**
 * JSONata-based formatter for preset responses. Mirrors the
 * FormatterRepository used by views but expects the Data-Service preset
 * payload (flat JSON) as the input root.
 */
@Injectable()
export class PresetFormatterRepository implements IPresetFormatterRepository {
  private readonly logger = new Logger(PresetFormatterRepository.name);
  private readonly cache = new Map<string, any>();
  private readonly formattersPath = path.join(
    process.cwd(),
    "src",
    "infrastructure",
    "formatters",
  );

  constructor(
    @Inject("IEnvironmentConfigService")
    private readonly environmentConfig: EnvironmentConfigService,
  ) {}

  async format(formatter: string, data: PresetData): Promise<PresetData> {
    try {
      const expression = await this.loadExpression(formatter);
      const result = await expression.evaluate(data);
      return (result ?? data) as PresetData;
    } catch (error) {
      this.logger.error(
        `Error formatting preset with '${formatter}': ${error.message}`,
      );
      throw error;
    }
  }

  private async loadExpression(formatter: string): Promise<any> {
    if (
      this.cache.has(formatter) &&
      this.environmentConfig.env !== "development"
    ) {
      return this.cache.get(formatter);
    }

    const formatterPath = path.join(
      this.formattersPath,
      `${formatter}.jsonata`,
    );

    try {
      await access(formatterPath);
    } catch {
      throw new Error(`Formatter file not found: ${formatterPath}`);
    }

    const content = await readFile(formatterPath, "utf8");
    const compiled = jsonata(content);
    registerHelpers(compiled);
    this.cache.set(formatter, compiled);
    return compiled;
  }
}

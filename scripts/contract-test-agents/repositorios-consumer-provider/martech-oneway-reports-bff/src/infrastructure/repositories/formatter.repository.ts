import { Inject, Injectable, Logger } from "@nestjs/common";
import { IFormatterRepository } from "@domain/repositories/formatter.repository.interface";
import { DataSource } from "@domain/entities/view.entity";
import jsonata from "jsonata";
import * as fs from "fs";
import * as path from "path";
import { EnvironmentConfigService } from "@common/config/environment-config.service";
import { registerHelpers } from "./helpers";

@Injectable()
export class FormatterRepository implements IFormatterRepository {
  private readonly logger = new Logger(FormatterRepository.name);
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

  /**
   * @inheritDoc
   */
  async format(formatter: string, data: DataSource[]): Promise<any> {
    try {
      // Load the jsonata expression from file
      const expression = await this.loadJsonataExpression(formatter);

      // Create datasources object with named data sources
      const datasources = this.createDatasourcesObject(data);

      // Execute the jsonata expression
      const result = await expression.evaluate(datasources);
      return result;
    } catch (error) {
      this.logger.error(
        `Error formatting data with formatter '${formatter}': ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Loads and compiles a jsonata expression from file
   * Loads from cache if available, otherwise loads from filesystem and caches it
   * @param formatter - The formatter path
   * @returns Compiled jsonata expression
   */
  private async loadJsonataExpression(formatter: string): Promise<any> {
    // Check cache first
    if (
      this.cache.has(formatter) &&
      this.environmentConfig.env !== "development"
    ) {
      return this.cache.get(formatter)!;
    }

    const formatterPath = path.join(
      this.formattersPath,
      `${formatter}.jsonata`,
    );

    if (!fs.existsSync(formatterPath)) {
      throw new Error(`Formatter file not found: ${formatterPath}`);
    }

    const expressionContent = fs.readFileSync(formatterPath, "utf8");
    const compiledExpression = jsonata(expressionContent);

    registerHelpers(compiledExpression);

    // Cache the compiled expression
    this.cache.set(formatter, compiledExpression);

    return compiledExpression;
  }

  /**
   * Creates a datasources object with named data sources
   * @param data - Array of data sources
   * @returns Object with named data sources
   */
  private createDatasourcesObject(data: DataSource[]): any {
    const datasources: any = {};

    data.forEach((dataSource) => {
      datasources[dataSource.title ?? dataSource.name] = dataSource.data;
    });

    return { datasources };
  }
}

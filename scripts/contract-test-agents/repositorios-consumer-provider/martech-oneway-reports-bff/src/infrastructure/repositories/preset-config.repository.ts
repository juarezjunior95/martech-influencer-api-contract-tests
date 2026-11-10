import { Injectable, Logger } from "@nestjs/common";
import { IPresetConfigRepository } from "@domain/repositories/preset-config.repository.interface";
import { PresetConfig } from "@domain/entities/preset.entity";
import { InvalidPresetConfigError } from "@domain/exceptions/invalid-preset-config.error";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

const PRESET_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

@Injectable()
export class PresetConfigRepository implements IPresetConfigRepository {
  private readonly logger = new Logger(PresetConfigRepository.name);
  private readonly require = createRequire(__filename);
  private readonly presetsPath = path.join(
    process.cwd(),
    "dist",
    "src",
    "domain",
    "config",
    "presets",
  );

  async getByName(presetName: string): Promise<PresetConfig | null> {
    try {
      const formattedName = this.formatPresetName(presetName);
      const configPath = this.resolveConfigPath(formattedName);

      if (!configPath) {
        this.logger.warn(`Preset configuration not found for: ${presetName}`);
        return null;
      }

      if (process.env.NODE_ENV === "development") {
        delete this.require.cache[this.require.resolve(configPath)];
      }

      const configData = this.require(configPath);
      return configData.default || configData;
    } catch (error) {
      if (error instanceof InvalidPresetConfigError) {
        throw error;
      }
      this.logger.error(
        `Error loading preset configuration for ${presetName}: ${error.message}`,
      );
      return null;
    }
  }

  private resolveConfigPath(formattedName: string): string | null {
    const leaf = path.basename(formattedName);
    const folderPath = path.join(
      this.presetsPath,
      formattedName,
      `${leaf}.preset.js`,
    );
    if (fs.existsSync(folderPath)) {
      return folderPath;
    }

    const flatPath = path.join(this.presetsPath, `${formattedName}.preset.js`);
    if (fs.existsSync(flatPath)) {
      return flatPath;
    }

    return null;
  }

  private formatPresetName(presetName: string): string {
    if (!PRESET_NAME_PATTERN.test(presetName)) {
      throw new InvalidPresetConfigError(`Invalid preset name: ${presetName}`);
    }
    return presetName.replaceAll("_", "/");
  }
}

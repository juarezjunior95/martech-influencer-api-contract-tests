import { IPresetConfigRepository } from "@domain/repositories/preset-config.repository.interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PresetConfig } from "@domain/entities/preset.entity";
import path from "path";
import fs from "fs";
import { FileLoaderService } from "@common/services/file-loader.service";

const PRESET_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Repository for loading preset configurations from TypeScript files
 * Handles dynamic loading of datasource config files with in-memory caching.
 *
 * Supports two layouts under `src/domain/config/presets/`:
 *   - Folder-per-preset: `<name>/<name>.preset.js` (preferred — each
 *     preset owns its own folder for types/handler/defaults).
 *   - Flat:              `<name>.preset.js` (legacy, still supported
 *     for trivial presets that don't justify a folder).
 *
 * The folder layout is tried first; the flat layout is the fallback.
 */
@Injectable()
export class PresetConfigRepository implements IPresetConfigRepository {
  constructor(private readonly fileLoaderService: FileLoaderService) {}

  async getByName(presetName: string): Promise<PresetConfig> {
    return this.fileLoaderService.load<PresetConfig>(
      this.getConfigPath(presetName),
    );
  }

  /**
   * Resolves the full path to a preset config file.
   * Converts underscores to slashes for nested presets, then prefers
   * the folder layout (`<name>/<name>.preset.js`) over the flat one.
   *
   * @param presetName e.g. `brands`, `years`, `country`
   */
  private getConfigPath(presetName: string): string {
    if (!PRESET_NAME_PATTERN.test(presetName)) {
      throw new BadRequestException(`Invalid preset name: ${presetName}`);
    }
    const formattedPath = presetName.replaceAll("_", "/");
    const presetsDir = path.join(
      process.cwd(),
      "dist",
      "src",
      "domain",
      "config",
      "presets",
    );

    const leaf = path.basename(formattedPath);
    const folderPath = path.join(
      presetsDir,
      formattedPath,
      `${leaf}.preset.js`,
    );
    if (fs.existsSync(folderPath)) {
      return folderPath;
    }

    return path.join(presetsDir, `${formattedPath}.preset.js`);
  }
}

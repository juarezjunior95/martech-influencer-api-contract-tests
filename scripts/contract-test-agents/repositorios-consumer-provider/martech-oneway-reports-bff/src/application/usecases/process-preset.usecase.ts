import { Inject, Injectable, Logger } from "@nestjs/common";
import { IProcessPresetUseCase } from "../interfaces/process-preset.usecase.interface";
import { IPresetConfigRepository } from "@domain/repositories/preset-config.repository.interface";
import { IPresetRepository } from "@domain/repositories/preset.repository.interface";
import { IPresetFormatterRepository } from "@domain/repositories/preset-formatter.repository.interface";
import {
  Preset,
  PresetData,
  PresetFilter,
  ProcessedPresetResult,
} from "@domain/entities/preset.entity";

@Injectable()
export class ProcessPresetUseCase implements IProcessPresetUseCase {
  private readonly logger = new Logger(ProcessPresetUseCase.name);

  constructor(
    @Inject("IPresetConfigRepository")
    private readonly presetConfigRepository: IPresetConfigRepository,
    @Inject("IPresetRepository")
    private readonly presetRepository: IPresetRepository,
    @Inject("IPresetFormatterRepository")
    private readonly formatterRepository: IPresetFormatterRepository,
  ) {}

  async execute(
    presetName: string,
    filters?: PresetFilter[],
  ): Promise<ProcessedPresetResult> {
    const preset = await this.createPresetEntity(presetName, filters);
    return this.processPresetEntity(preset);
  }

  async createPresetEntity(
    presetName: string,
    filters?: PresetFilter[],
  ): Promise<Preset> {
    const config = await this.presetConfigRepository.getByName(presetName);
    return Preset.create({ name: presetName, config, filters });
  }

  async processPresetEntity(preset: Preset): Promise<ProcessedPresetResult> {
    const presetName = preset.getName();
    const refs = preset.getPresetRefs();

    const responses = await Promise.all(
      refs.map((ref) =>
        this.presetRepository.getPreset(ref, preset.getFiltersFor(ref)),
      ),
    );

    const rawData: PresetData =
      refs.length === 1
        ? responses[0]
        : refs.reduce<PresetData>((acc, ref, idx) => {
            acc[ref] = responses[idx][ref];
            return acc;
          }, {});

    let data = await this.applyPerRefFormatters(preset, refs, rawData);

    const formatter = preset.getFormatter();
    if (formatter) {
      data = await this.formatterRepository.format(formatter, data);
    }

    this.logger.log(`Preset '${presetName}' processed`);

    return { name: presetName, data };
  }

  /**
   * When `preset` is the Record form, applies each ref’s `formatter` to
   * `{ [ref]: merged[ref] }` so JSONata written for a standalone preset
   * (single top-level key) stays valid inside composites.
   */
  private async applyPerRefFormatters(
    preset: Preset,
    refs: string[],
    merged: PresetData,
  ): Promise<PresetData> {
    if (!refs.some((ref) => preset.getRefFormatter(ref))) {
      return merged;
    }

    let data: PresetData = { ...merged };
    for (const ref of refs) {
      const fmt = preset.getRefFormatter(ref);
      if (!fmt) continue;
      const branch = data[ref];
      if (branch === undefined) continue;
      const formatted = await this.formatterRepository.format(fmt, {
        [ref]: branch,
      });
      const next = { ...data };
      delete next[ref];
      data = { ...next, ...formatted };
    }
    return data;
  }
}

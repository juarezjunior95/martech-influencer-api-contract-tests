import { IUseCase } from "@application/interfaces/usecase.interface";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { PresetResponse } from "@domain/entities/preset.entity";
import { Filter } from "@domain/entities/common/base-config.entity";
import { PresetFactory } from "@domain/factories/preset.factory";
import { IUserRepository } from "@domain/repositories/user.repository.interface";

/**
 * Fetch Preset Use Case
 * Fetches data from a specific preset with optional filters. The request
 * user is resolved from the propagated JWT and handed to the PresetEntity
 * so it can apply permission filtering (RFC-003).
 */
@Injectable()
export class FetchPresetUseCase implements IUseCase<
  { presetName: string; filters: Filter[] },
  PresetResponse
> {
  private readonly logger = new Logger(FetchPresetUseCase.name);

  constructor(
    @Inject("PresetFactory")
    private readonly presetFactory: PresetFactory,
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ presetName, filters }): Promise<PresetResponse> {
    try {
      const [preset, user] = await Promise.all([
        this.presetFactory.create(presetName),
        this.userRepository.getCurrentUser(),
      ]);

      const data = await preset.fetch(filters, user ?? undefined);

      this.logger.log(`Preset '${presetName}' fetched successfully`);

      return data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch preset ${presetName}: ${error.message}`,
      );
      throw error;
    }
  }
}

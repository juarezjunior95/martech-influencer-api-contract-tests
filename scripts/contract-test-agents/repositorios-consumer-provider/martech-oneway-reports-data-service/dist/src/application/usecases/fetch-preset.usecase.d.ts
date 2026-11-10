import { IUseCase } from "@application/interfaces/usecase.interface";
import { PresetResponse } from "@domain/entities/preset.entity";
import { Filter } from "@domain/entities/common/base-config.entity";
import { PresetFactory } from "@domain/factories/preset.factory";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
export declare class FetchPresetUseCase implements IUseCase<{
    presetName: string;
    filters: Filter[];
}, PresetResponse> {
    private readonly presetFactory;
    private readonly userRepository;
    private readonly logger;
    constructor(presetFactory: PresetFactory, userRepository: IUserRepository);
    execute({ presetName, filters }: {
        presetName: any;
        filters: any;
    }): Promise<PresetResponse>;
}

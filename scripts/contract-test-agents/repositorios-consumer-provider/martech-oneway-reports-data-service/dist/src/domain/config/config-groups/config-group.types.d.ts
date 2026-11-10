export interface ConfigGroup<TConfig extends object> {
    name: string;
    config: TConfig;
}

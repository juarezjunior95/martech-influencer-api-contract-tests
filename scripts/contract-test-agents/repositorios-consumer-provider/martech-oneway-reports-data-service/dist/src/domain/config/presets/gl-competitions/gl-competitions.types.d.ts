export interface CompetitionDivision {
    value: string;
    label: string;
}
export interface Competition {
    value: string;
    label: string;
    divisions?: CompetitionDivision[];
    default?: CompetitionDivision;
}
export interface CompetitionDefault {
    value: string;
    label: string;
}
export interface GlCompetitionsPresetValue {
    enabled: boolean;
    default: CompetitionDefault | Record<string, never>;
    values: Competition[];
}
export interface GlCompetitionsPresetConfig {
    type?: string;
}

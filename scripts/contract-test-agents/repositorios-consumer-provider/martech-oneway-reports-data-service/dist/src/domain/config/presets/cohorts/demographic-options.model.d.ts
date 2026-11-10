export interface DemographicTuple {
    value: string;
    label: string;
    full: string;
}
export declare function getAllGenderTuples(): DemographicTuple[];
export declare function getAllAgeGroupTuples(): DemographicTuple[];
export declare function getAllIncomeGroupTuples(): DemographicTuple[];
export declare function getAllSocialEconomicLevelTuples(): DemographicTuple[];
export declare function tuplesWithoutAll(rows: DemographicTuple[]): DemographicTuple[];

import {
  BigNumber,
  BigNumberBrandVolume,
  BigNumberDemographic,
  BigNumberSecondaryInfo,
  EmptyStateConfig,
} from 'components/BigNumber/types';

export type BrandAudiencesCardHeader = {
  title?: string;
  subtitle?: string;
  tooltip?: string;
  emptyMessage?: string;
  emptyStateConfig?: EmptyStateConfig;
};

export type BrandAudiencesCardItem = {
  audience: BigNumberDemographic;
  brandVolume?: BigNumberBrandVolume;
  audienceType?: 'core' | 'halo';
};

export type MetricCardItem = {
  bigNumber: BigNumber;
  secondaryInfo: BigNumberSecondaryInfo;
};

export type BrandAudiencesCardData =
  BrandAudiencesCardItem[] | MetricCardItem[];

export type BrandAudiencesTargetingCardModel = {
  header: BrandAudiencesCardHeader;
  data: BrandAudiencesCardData;
};

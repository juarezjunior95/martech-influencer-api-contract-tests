export type BigNumberDemographic = {
  gender?: string[];
  age?: string[];
  incomeBracket?: string[];
};

export type BigNumberBrandVolume = {
  value: string;
  color: string;
  label: string;
  measure?: string;
  emptyStateMessage?: string;
};

export type BigNumber = {
  value: string | number;
  measure?: string;
  color?: string;
  trend?: 'positive' | 'negative';
};

export type BigNumberComparison = {
  number?: {
    value?: string;
    measure?: string;
    color?: string;
    trend?: 'positive' | 'negative';
  };
  label?: string;
  value?: string;
};

export type BigNumberSecondaryInfo = {
  value?: string;
  measure?: string;
  label?: string;
  period?: BigNumberPeriod;
};

export type BigNumberPeriod = {
  label: string;
  value: string;
};

export type BigNumberSize = 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
export type BigNumberSpacing = 'loose' | 'cozy';
export type BigNumberOrientation =
  'vertical' | 'horizontal' | 'none' | 'center';

export type BigNumberAlignment = 'left' | 'center';

export type BigNumberData = {
  audience?: BigNumberDemographic;
  bigNumber?: BigNumber;
  comparison?: BigNumberComparison;
  secondaryInfo?: BigNumberSecondaryInfo;
  brandVolume?: BigNumberBrandVolume;
  audienceType?: 'core' | 'halo';
};

export type EmptyStateConfig = {
  color?: string;
  justifyContent?: 'start' | 'center';
  imageSize?: { height?: string; width?: string };
  inline?: boolean;
};

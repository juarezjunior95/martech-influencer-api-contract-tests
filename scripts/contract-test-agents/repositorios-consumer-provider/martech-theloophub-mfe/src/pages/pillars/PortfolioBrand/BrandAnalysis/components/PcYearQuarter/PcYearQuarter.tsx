import { SubFilter } from 'components';

interface PcYearQuarterProps {
  yearQuarterSelected: string;
  stateKeys?: {
    year: string;
    quarter: string;
  };
}

export const PcYearQuarter: React.FC<PcYearQuarterProps> = ({
  yearQuarterSelected,
  stateKeys: stateKeysProps,
}) => {
  const defaultStateKeys = {
    year: 'pc_time_frame_years',
    quarter: 'pc_time_frame_quarters',
  };
  const stateKeys = { ...defaultStateKeys, ...stateKeysProps };

  return yearQuarterSelected === 'year' ? (
    <SubFilter.Select apiKey="pc-time-frame-years" stateKey={stateKeys.year} />
  ) : (
    <SubFilter.Select
      apiKey="pc-time-frame-quarters"
      stateKey={stateKeys.quarter}
    />
  );
};

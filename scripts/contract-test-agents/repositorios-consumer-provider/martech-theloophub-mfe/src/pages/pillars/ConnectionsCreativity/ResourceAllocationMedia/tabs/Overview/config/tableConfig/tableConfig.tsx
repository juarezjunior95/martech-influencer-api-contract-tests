import { ColumnDefsConfig } from 'components';

const baseColumnConfig = {
  minWidth: 202,
};

const createColumnConfig = (headerClass?: string, minWidth?: number) => ({
  ...baseColumnConfig,
  headerClass: headerClass,
  minWidth: minWidth || baseColumnConfig.minWidth,
});

export const createGuidelineColumnConfig = (
  shouldShowTooltip: boolean,
  tooltipMessage?: string,
) => ({
  ...createColumnConfig(),
  ...(shouldShowTooltip && {
    headerTooltip: tooltipMessage,
    headerComponentParams: {
      tooltip: true,
      tooltipHideIcon: false,
      tooltipCellStyle: 'dark',
      tooltipHeaderStyle: 'dark',
    },
  }),
});

const deepDiveConfig: ColumnDefsConfig = {
  countries: createColumnConfig(),
  brands: createColumnConfig(),
  ly: createColumnConfig(),
  bu: createColumnConfig(),
  current_year_: createColumnConfig(),
  previous_year_: createColumnConfig(),
  guideline: createColumnConfig(),
};

export default deepDiveConfig;

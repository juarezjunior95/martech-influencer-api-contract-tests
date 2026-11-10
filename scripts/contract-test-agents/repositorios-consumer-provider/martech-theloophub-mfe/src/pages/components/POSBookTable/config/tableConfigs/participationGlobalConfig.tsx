import { ColumnDefsConfig } from 'components';
import { StyledTooltip } from 'shared/Styles';

import { commonHeaderConfig } from '../constants';
import { combineCellClasses, customCountryCellClass } from '../utils';

const otherCompetitors = {
  headerTooltip: (
    <StyledTooltip size="small">
      <span>
        To identify the local competitor for each country, hover the mouse over
        the respective bar.
      </span>
      <br />
      <span>
        If a country does not have a competitor bar, it means there is no local
        competitor in that country.
      </span>
    </StyledTooltip>
  ) as any,
  headerComponentParams: {
    tooltip: true,
    tooltipHideIcon: true,
    tooltipCellStyle: 'dark',
    // shouldTruncate: true,
  },
  headerClass: ['ag-header-bg-blue', 'ag-header-pos-book'],
};

export const globalParticipationTableConfig: ColumnDefsConfig = {
  ...commonHeaderConfig,
  label: {
    maxWidth: 64,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
    headerComponentParams: { merge: true },
  },
  country: {
    maxWidth: 54,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
  },
  other_competitors: otherCompetitors,
  other_competitors_core_co: otherCompetitors,
  other_competitors_premium_co: otherCompetitors,
};

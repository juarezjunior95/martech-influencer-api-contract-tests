import { CellClassParams } from 'ag-grid-community';
import { cellClass } from 'components/Table/cellClass';

const portfolioCellClass = (params: CellClassParams) => {
  const classes = [...cellClass(params)];
  if (params.rowIndex === 0) {
    classes.push('ag-cell-first-row');
  }
  const portfolio = params.data['portfolio'];
  if (portfolio) classes.push(`ag-cell-${portfolio.toLowerCase()}`);

  return classes;
};

interface PortfolioColumnOptions {
  minWidth: number;
  headerClass: string[];
  maxWidth?: number;
  cellClasses?: string[];
}

const createPortfolioColumn = ({
  minWidth,
  headerClass,
  maxWidth,
  cellClasses,
}: PortfolioColumnOptions) => ({
  minWidth,
  ...(maxWidth ? { maxWidth } : null),
  headerClass,
  cellClass: (params: CellClassParams) => {
    const classes = [...portfolioCellClass(params), ...(cellClasses || [])];
    return classes;
  },
});

const createIntermediateColumn = (minWidth = 75) => {
  return createPortfolioColumn({
    minWidth,
    headerClass: ['intermediate-header'],
  });
};

const createFinalColumn = (minWidth = 75) => {
  return createPortfolioColumn({
    minWidth,
    headerClass: ['final-header'],
    cellClasses: ['ag-cell-final-header'],
  });
};

const portfolioColumns = {
  portfolio: {
    ...createPortfolioColumn({
      minWidth: 20,
      maxWidth: 20,
      headerClass: ['portfolio-header'],
    }),
    headerComponentParams: {
      merge: true,
    },
  },
  brands: createPortfolioColumn({
    minWidth: 100,
    headerClass: ['brands-header'],
  }),
};

const volumeColumns = {
  volume_AC: createIntermediateColumn(),
  volume_LY: createFinalColumn(),
};

const marketingColumns = {
  marketing_package_FY_BU: createIntermediateColumn(),
  marketing_package_YTD_BU: createIntermediateColumn(),
  marketing_package_YTD_AC: createIntermediateColumn(),
  marketing_package_COM: createFinalColumn(),
};

const nwmColumns = {
  nwm_fy_bu: createIntermediateColumn(),
  nwm_ytd_bu: createIntermediateColumn(),
  nwm_ytd_ac_investment: createIntermediateColumn(),
  nwm_ytd_ac: createIntermediateColumn(80),
  nwm_ytd_ac_2: createFinalColumn(120),
};

const mediaColumns = {
  media_fy_bu_qwoa: createIntermediateColumn(),
  media_ytd_bu_qwoa: createIntermediateColumn(),
  media_ytd_ac: createIntermediateColumn(),
  media_ytd_bu_investment: createIntermediateColumn(),
  media_fy_bu_investment: createIntermediateColumn(),
  media_ytd_ac_investment: createIntermediateColumn(),
  media_ytd_ac_mkt: createFinalColumn(),
};

const sponsorshipColumns = {
  sponsorship_fy_bu: createIntermediateColumn(),
  sponsorship_ytd_bu: createIntermediateColumn(),
  sponsorship_ytd_ac_investment: createIntermediateColumn(),
  sponsorship_ytd_ac: createPortfolioColumn({ minWidth: 85, headerClass: [] }),
};

export const tableConfig = {
  ...portfolioColumns,
  ...volumeColumns,
  ...marketingColumns,
  ...nwmColumns,
  ...mediaColumns,
  ...sponsorshipColumns,
};

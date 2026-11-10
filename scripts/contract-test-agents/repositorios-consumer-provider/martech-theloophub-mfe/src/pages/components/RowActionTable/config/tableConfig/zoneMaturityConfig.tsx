import { CellClassParams } from 'ag-grid-community';
import { cellClass } from 'components/Table/cellClass';

import { ChartCellRenderer, DoubleValueRenderer } from '../cellRenderer';

const customCellClass = (params: CellClassParams) => {
  const borderBottom = params.data?.label_config?.borderBottom;
  const groupBorder = params.data?.label_config?.groupBorder;
  const borderMerge = params.colDef.headerComponentParams?.borderMerge;

  const defaultClasses = [...cellClass(params)];
  if (borderBottom || (borderMerge && groupBorder)) {
    return [...defaultClasses, 'border-bottom'];
  }

  return defaultClasses;
};

interface ZoneMaturityConfigProps {
  someRowWasSelected: boolean;
  chartHeight?: number;
  globalScale?: number;
  acWidth?: number;
}

export const zoneMaturityConfig = ({
  someRowWasSelected,
  chartHeight = 24,
  globalScale,
  acWidth = 155,
}: ZoneMaturityConfigProps) => ({
  label: {
    minWidth: 56,
    maxWidth: 56,
    cellClass: customCellClass,
    headerComponentParams: {
      merge: true,
      borderMerge: true,
    },
  },
  id: {
    minWidth: 56,
    maxWidth: 56,
    headerComponentParams: {
      merge: true,
    },
    cellClass: customCellClass,
  },
  ac: {
    minWidth: acWidth,
    headerClass: ['ag-column-separator'],
    cellRenderer: (params) =>
      ChartCellRenderer(params, someRowWasSelected, chartHeight, globalScale),
    cellClass: customCellClass,
  },
  ly: {
    headerClass: ['ag-column-separator'],
    cellRenderer: DoubleValueRenderer,
    cellClass: customCellClass,
  },
  lq: { cellRenderer: DoubleValueRenderer, cellClass: customCellClass },
});

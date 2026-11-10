import { GridOptions } from 'ag-grid-community';

import { cellClass } from '../cellClass';
import { cellRenderer } from '../cellRenderer';
import { CustomAgGridTooltip, CustomHeader } from '../components';
import { cellStyle, colSpan, rowSpan, tooltipValueGetter } from './callbacks';

const defaultColDef: GridOptions['defaultColDef'] = {
  sortable: false,
  colSpan,
  cellRenderer,
  cellClass,
  rowSpan,
  cellStyle,
  tooltipValueGetter,
  headerComponentParams: {
    chartBackground: '',
    merge: false,
    icon: '',
    subtitle: '',
    tooltip: false,
    tooltipHeaderStyle: 'light',
    tooltipCellStyle: 'light',
    imgName: '',
    shouldTruncate: false,
  },
  headerComponent: 'customHeader',
  tooltipComponent: 'customAgGridTooltip',
};

const defaultColGroupDef: GridOptions['defaultColGroupDef'] = {
  ...defaultColDef,
  headerGroupComponentParams: {
    ...defaultColDef.headerComponentParams,
  },
  headerGroupComponent: defaultColDef.headerComponent,
};

export const gridOptions: GridOptions = {
  suppressRowTransform: true,
  defaultColDef,
  defaultColGroupDef,
  components: {
    customHeader: CustomHeader,
    customAgGridTooltip: CustomAgGridTooltip,
  },
  autoSizeStrategy: {
    type: 'fitGridWidth',
  },
};

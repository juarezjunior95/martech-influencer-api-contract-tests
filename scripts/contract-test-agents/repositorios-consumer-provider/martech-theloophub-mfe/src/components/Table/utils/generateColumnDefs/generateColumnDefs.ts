import { ColDef } from 'ag-grid-community';
import { GanttChartHeader } from 'components/GanttChart/components/GanttChartHeader/GanttChartHeader';
import { merge } from 'lodash';

import { ColumnDefsConfig } from '../../Table';
import { TableHeaderType } from '../../types';

interface ColumnDefWithChildren extends ColDef {
  headerComponentParams?: any;
  headerGroupComponentParams?: any;
  children?: ColDef[];
}

const HEADER_TYPES = {
  GANTT: 'gantt',
} as const;

const HEADER_COMPONENTS = {
  [HEADER_TYPES.GANTT]: GanttChartHeader,
} as const;

const generateColumns = (
  headers: TableHeaderType[],
  configs: ColumnDefsConfig | undefined,
) => {
  return headers.map((header) => {
    const params = {
      subtitle: header.subtitle,
      imgName: header.imgName,
      dataTestId: header.dataTestId, //header.dataTestId,
      headerTooltip: configs?.[header.title]?.headerTooltip,
      ...header.params,
    };
    const column: ColumnDefWithChildren = {
      headerName: header.title,
      field: header.id,
      headerComponentParams: params,
      headerGroupComponentParams: params,
    };
    if (params?.type === HEADER_TYPES.GANTT) {
      column.headerComponent = HEADER_COMPONENTS[HEADER_TYPES.GANTT];
      column.headerComponentParams = {
        ...params?.data,
        merge: false,
        tooltip: params?.headerTooltip,
      };
    }

    if (header.id || header.title) {
      const config =
        configs?.[header.id] ||
        configs?.[header.title] ||
        configs?.[header.id?.split('_')[0] + '_'];

      if (config) {
        merge(column, config);
      }
    }

    if (header.children && header.children.length > 0) {
      column.children = generateColumns(header.children, configs);
    }

    return column;
  });
};

export const generateColumnDefs = (
  data: TableHeaderType[],
  configs: ColumnDefsConfig | undefined,
) => {
  return generateColumns(data, configs);
};

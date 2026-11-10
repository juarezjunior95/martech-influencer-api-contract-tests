import { WithEmpty } from 'utils/dataEmpty';
import { getVariationColor } from 'utils/getColor';

import {
  TableCellType,
  TableDataType,
  TableGroupType,
  TableRowType,
} from '../../types';

/**
 * Transforms the original AgGrid data structure into the new generic table format
 * @param originalData The original AgGrid data object
 * @returns The transformed generic table data
 */
export function transformAgGridData(
  originalData: any,
): WithEmpty<TableDataType> {
  let data: WithEmpty<TableDataType>;
  if (originalData.empty) {
    data = {
      empty: true,
      header: [],
      rows: [],
    };

    return data;
  }
  // Extract column definitions to create headers
  const headers = extractHeaders(originalData.columnDefs);

  // Transform row data
  const rows = transformRows(originalData.rowData);

  data = {
    header: headers,
    rows: rows,
  };

  return data;
}

/**
 * Extracts header information from AG Grid column definitions
 * @param columnDefs The original column definitions
 * @returns An array of table headers
 */
function extractHeaders(columnDefs: any[]): any[] {
  return columnDefs.map((column) => {
    const params = {
      ...column.headerComponentParams,
      ...column.headerGroupComponentParams,
    };
    const header: any = {
      id: column.field,
      title: column.headerName,
      ...params,
    };

    // Process children if they exist
    if (column.children && column.children.length > 0) {
      header.children = extractHeaders(column.children);
    }

    return header;
  });
}

/**
 * Transforms row data into grouped table rows
 * @param rowData The original row data array
 * @returns An array of table groups
 */
function transformRows(rowData: any[]): TableGroupType[] {
  const groups: TableGroupType[] = [];
  let currentGroup: TableRowType[] = [];

  rowData.forEach((row) => {
    if (!row || Object.keys(row).length === 0) {
      if (currentGroup.length > 0) {
        groups.push([...currentGroup]);
        currentGroup = [];
      }
      return;
    }

    const newRow: Record<string, TableCellType> = {};

    Object.keys(row).forEach((key) => {
      if (key === 'sourceTooltip') return;
      if (key.endsWith('_config')) return;

      const value = row[key];
      const configKey = `${key}_config`;
      const config = structuredClone(row[configKey] || {});

      if (key === 'source' && row.sourceTooltip && !config.tooltip) {
        config.tooltip = row.sourceTooltip;
      }

      config.value = value;

      if (config.variationDirection) {
        config.variationDirection = getVariationColor(
          config.variationDirection,
        );
      }

      if (config.leftImg) {
        config.img = config.leftImg;
        delete config.leftImg;
      }

      if (config.chartData || config.chartLabel) {
        config.chartData = {
          data: config?.chartData,
          labels: config?.chartLabel,
        };
      }

      if (config.mergeCol) {
        config.colSpan = config.mergeCol;
      }

      if (config.imageName) {
        config.imgName = config.imageName;
      }

      if (typeof config.value === 'object' && config.value !== null) {
        config.chartData = { ...config.value };
        config.variation = config.value.variation;
        config.variationMeasure = config.unitMeasure;

        delete config.unitMeasure;
        delete config.value;
      }

      newRow[key] = config;
    });

    currentGroup.push(newRow);
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

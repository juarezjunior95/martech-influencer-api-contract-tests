import { GroupCellRendererParams } from 'ag-grid-community';
import { TableCellType } from 'components/Table/types';
import { formatNumber } from 'utils/format';
import { isNumber } from 'utils/regex';

import { DoubleValueContainer } from './components/DoubleValueContainer';

export const DoubleValueRenderer = (
  params: GroupCellRendererParams,
  dataTestId?: string,
): JSX.Element => {
  const field = params.colDef.field;
  const config = params.data[field + '_config'] as TableCellType;

  const value =
    isNumber.test(params.value) && typeof params.value === 'number'
      ? formatNumber(params.value)
      : params.value;
  const value2 =
    isNumber.test(config?.value2) && typeof config.value2 === 'number'
      ? formatNumber(config.value2)
      : config?.value2;

  return (
    <div
      data-testid={
        dataTestId ? `${dataTestId}-double-value-container` : undefined
      }
      className="ag-cell-content"
    >
      <DoubleValueContainer
        dataTestId={
          dataTestId ? `${dataTestId}-double-value-container` : undefined
        }
        value={value}
        value2={value2}
        unitMeasure={config?.unitMeasure}
        unitMeasure2={config?.unitMeasure2}
        variationDirection2={config?.variationDirection2}
      />
    </div>
  );
};

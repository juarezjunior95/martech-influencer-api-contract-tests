import { getVariationColor } from 'utils/getColor';

interface Props {
  dataTestId?: string;
  value: string;
  value2: string;
  unitMeasure: string;
  unitMeasure2: string;
  variationDirection2: string;
}

export const DoubleValueContainer = ({
  dataTestId,
  value,
  value2,
  unitMeasure,
  unitMeasure2,
  variationDirection2,
}: Props) => {
  return (
    <div
      className="ag-cell-double-value"
      data-testid={dataTestId || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <span data-testid={dataTestId ? `${dataTestId}-value` : undefined}>
        {value}
        {unitMeasure}
      </span>
      <span
        data-testid={dataTestId ? `${dataTestId}-value2` : undefined}
        style={{
          color: getVariationColor(variationDirection2),
        }}
      >
        {value2}
        {unitMeasure2}
      </span>
    </div>
  );
};

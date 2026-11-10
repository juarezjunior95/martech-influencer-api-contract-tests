import React from 'react';

interface UnitMeasureRendererProps {
  unitMeasure: string;
  value: any;
}

export const UnitMeasureRenderer = ({
  value,
  unitMeasure,
}: UnitMeasureRendererProps): JSX.Element => {
  return (
    <React.Fragment>
      {value}
      {unitMeasure}
    </React.Fragment>
  );
};

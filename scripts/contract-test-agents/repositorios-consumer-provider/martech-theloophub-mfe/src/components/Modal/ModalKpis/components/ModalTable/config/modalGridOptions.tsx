import React from 'react';

import type { CustomTooltipProps } from 'ag-grid-react';
import { gridOptions } from 'components/Table/config/columnDefs';

import { StyledModalTooltip } from '../ModalTable.styles';

const ModalTooltip: React.FC<CustomTooltipProps> = ({ value }) => {
  if (!value) return <></>;

  const lines =
    typeof value === 'string' ? value.split(String.raw`\n`) : [value];

  return (
    <StyledModalTooltip>
      {lines.map((line, i) => (
        <React.Fragment key={`${i}-${line}`}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ))}
    </StyledModalTooltip>
  );
};

export const modalGridOptions = {
  ...gridOptions,
  components: {
    ...gridOptions?.components,
    customAgGridTooltip: ModalTooltip,
  },
};

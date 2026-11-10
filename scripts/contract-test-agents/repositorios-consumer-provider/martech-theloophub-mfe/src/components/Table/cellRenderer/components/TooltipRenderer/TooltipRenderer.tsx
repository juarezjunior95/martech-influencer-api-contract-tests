import { ReactNode } from 'react';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';

interface TooltipRendererProps {
  value: ReactNode;
}

export const TooltipRenderer = ({
  value,
}: TooltipRendererProps): JSX.Element => {
  return (
    <>
      {value} <Icon icon={Info} size="small" className="tooltip-icon" />
    </>
  );
};

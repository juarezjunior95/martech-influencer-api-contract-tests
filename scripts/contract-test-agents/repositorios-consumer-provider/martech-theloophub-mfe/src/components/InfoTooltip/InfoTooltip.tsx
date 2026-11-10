import React from 'react';

import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';

import { StyledInfoIcon, StyledTooltipText } from './InfoTooltip.styles';

type InfoTooltipSize = 'small' | 'default';

interface InfoTooltipProps {
  content: string;
  size?: InfoTooltipSize;
  dataTestId?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  size = 'small',
  dataTestId,
}) => (
  <CustomTooltip
    content={<StyledTooltipText size={size}>{content}</StyledTooltipText>}
    dataTestId={dataTestId}
  >
    <StyledInfoIcon icon={Info} size="small" tooltipSize={size} />
  </CustomTooltip>
);

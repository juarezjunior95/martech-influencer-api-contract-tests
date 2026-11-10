import { Heading } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';
import { StyledTooltip } from 'shared/Styles/typography.styles';

import {
  StyledContentCardHeader,
  StyledMainContainer,
} from './ContentCard.styles';

interface ContentCardProps {
  title: string;
  tooltip?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  noPaddingX?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  tooltip,
  children,
  fullWidth = false,
  noPaddingX = false,
}) => {
  return (
    <StyledMainContainer fullWidth={fullWidth} noPaddingX={noPaddingX}>
      <StyledContentCardHeader>
        <Heading size="H2">{title}</Heading>
        {tooltip && (
          <CustomTooltip
            content={<StyledTooltip size="small">{tooltip}</StyledTooltip>}
          >
            <Icon icon={Info} size="medium" />
          </CustomTooltip>
        )}
      </StyledContentCardHeader>
      {children}
    </StyledMainContainer>
  );
};

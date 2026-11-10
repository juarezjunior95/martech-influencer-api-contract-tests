import { Heading } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components';
import { StyledMainContainer, StyledTooltip } from 'shared/Styles';

import {
  StyledContentCardHeader,
  StyledTitleTooltipContainer,
} from './ContentCardWithBreadcrumb.styles';

export const ContentCardWithBreadcrumb = ({
  title,
  tooltip,
  children,
  dataTestId,
}: {
  title: string;
  tooltip: string;
  children: React.ReactNode;
  dataTestId?: string;
}) => {
  return (
    <StyledMainContainer fullWidth={true} data-testid={dataTestId}>
      <StyledContentCardHeader>
        <StyledTitleTooltipContainer>
          <Heading size="H2" data-testid={`${dataTestId}-title`}>
            {title}
          </Heading>

          {tooltip && (
            <CustomTooltip
              data-testid={`${dataTestId}-tooltip`}
              content={<StyledTooltip size="small">{tooltip}</StyledTooltip>}
            >
              <Icon icon={Info} size="medium" />
            </CustomTooltip>
          )}
        </StyledTitleTooltipContainer>
        <span data-testid={`${dataTestId}-breadcrumb`}>Breadcrumb</span>
      </StyledContentCardHeader>

      {children}
    </StyledMainContainer>
  );
};

import { IntlFormatters } from 'react-intl';

import { Paragraph } from '@hexa-ui/components';

import { SummaryHeaderContainer } from './SummaryHeader.styles';

interface SummaryHeaderProps {
  formatMessage: IntlFormatters['formatMessage'];
  dataTestId?: string;
}

export const SummaryHeader = ({
  formatMessage,
  dataTestId,
}: SummaryHeaderProps) => {
  return (
    <SummaryHeaderContainer data-testid={dataTestId}>
      <Paragraph
        style={{ fontWeight: 'bold', fontSize: '1.5rem' }}
        data-testid={dataTestId ? `${dataTestId}-title` : undefined}
      >
        {formatMessage({
          id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.SummaryBreakdown.title',
        })}
      </Paragraph>
    </SummaryHeaderContainer>
  );
};

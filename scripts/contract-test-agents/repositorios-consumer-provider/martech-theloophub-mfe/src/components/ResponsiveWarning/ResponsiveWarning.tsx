import { Heading, Paragraph } from '@hexa-ui/components';

import EmptyState from '../../assets/empty-state.png';
import { StyledResponsiveWarning } from './ResponsiveWarning.styles';

interface ResponsiveWarningProps {
  dataTestId?: string;
}

export const ResponsiveWarning = ({ dataTestId }: ResponsiveWarningProps) => {
  return (
    <StyledResponsiveWarning
      data-testid={dataTestId ? `responsive-warning-${dataTestId}` : undefined}
    >
      <img
        data-testid={
          dataTestId ? `responsive-warning-img-${dataTestId}` : undefined
        }
        className="empty-state-img"
        src={EmptyState}
        alt="Descrição"
      ></img>
      <Heading
        data-testid={
          dataTestId ? `responsive-warning-heading-${dataTestId}` : undefined
        }
        size="H2"
      >
        Mobile version coming soon
      </Heading>
      <Paragraph
        data-testid={
          dataTestId ? `responsive-warning-paragraph-${dataTestId}` : undefined
        }
        alignment="center"
        colortype="secondary"
      >
        In the meantime, please access the page using a desktop device.
      </Paragraph>
    </StyledResponsiveWarning>
  );
};

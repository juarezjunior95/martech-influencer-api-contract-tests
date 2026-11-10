import { Paragraph } from '@hexa-ui/components';

interface ErrorMessageProps {
  dataTestId?: string;
}

export const ErrorMessage = ({ dataTestId }: ErrorMessageProps) => (
  <Paragraph
    data-testid={dataTestId ? `error-message-${dataTestId}` : undefined}
    size="small"
  >
    Failed to load filters. Please try again later.
  </Paragraph>
);

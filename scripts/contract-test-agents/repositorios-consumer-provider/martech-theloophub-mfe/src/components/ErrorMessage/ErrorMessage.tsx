import { useIntl } from 'react-intl';

import { Paragraph } from '@hexa-ui/components';

interface ErrorMessageProps {
  dataTestId?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();

  return (
    <Paragraph
      data-testid={dataTestId ? `error-message-${dataTestId}` : undefined}
    >
      {formatMessage({ id: 'Error.noRecords', defaultMessage: '' })}{' '}
      <strong
        data-testid={
          dataTestId ? `error-message-strong-${dataTestId}` : undefined
        }
      >
        {formatMessage({ id: 'Error.filteredParameters', defaultMessage: '' })}
      </strong>
    </Paragraph>
  );
};

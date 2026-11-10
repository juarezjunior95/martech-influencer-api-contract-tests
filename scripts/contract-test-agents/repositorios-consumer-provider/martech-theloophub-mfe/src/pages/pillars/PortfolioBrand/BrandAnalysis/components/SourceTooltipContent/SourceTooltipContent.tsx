import { useIntl } from 'react-intl';

export const SourceTooltipContent = ({
  source,
  refresh,
  dataTestId,
}: {
  source: 'sunlight' | 'anaplan' | 'kantar';
  refresh: 'monthly' | 'quarterly' | 'yearly';
  dataTestId?: string;
}) => {
  const { formatMessage } = useIntl();

  return (
    <span data-testid={dataTestId}>
      {formatMessage({ id: 'Label.source' })}:{' '}
      {formatMessage({ id: 'Label.' + source })}.{' '}
      {formatMessage({ id: 'Label.refresh' })}:{' '}
      {formatMessage({ id: 'Label.' + refresh })}.
    </span>
  );
};

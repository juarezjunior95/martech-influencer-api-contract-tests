import { formatAudienceField } from '../../utils/formatters';
import { Separator } from '../Separator/Separator';

interface AudienceValueProps {
  fieldKey: string;
  value: unknown;
  dataTestId?: string;
}

export const AudienceValue = ({
  fieldKey,
  value,
  dataTestId,
}: AudienceValueProps) => {
  const formatted = formatAudienceField(fieldKey, value);

  if (formatted.type === 'text') {
    return (
      <div
        data-testid={dataTestId ? `${dataTestId}-text-${fieldKey}` : undefined}
      >
        {formatted.value}
      </div>
    );
  }

  return (
    <div
      data-testid={dataTestId ? `${dataTestId}-array-${fieldKey}` : undefined}
    >
      {Array.isArray(formatted.value) &&
        formatted.value.map((item, index) => (
          <span
            key={`${item}-${index}`}
            data-testid={dataTestId ? `${dataTestId}-item-${index}` : undefined}
          >
            {item}
            {index < formatted.value.length - 1 && (
              <Separator dataTestId={dataTestId} />
            )}
          </span>
        ))}
    </div>
  );
};

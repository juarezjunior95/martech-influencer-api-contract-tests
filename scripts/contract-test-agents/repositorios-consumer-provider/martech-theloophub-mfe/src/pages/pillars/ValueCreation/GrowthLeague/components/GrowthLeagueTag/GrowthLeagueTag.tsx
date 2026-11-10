import { Tag } from 'components/Tag';
import { formatNumber } from 'utils/format';

interface GrowthLeagueTagProps {
  dataTestId?: string;
  value: string | number;
  unitMeasure?: string;
}

export const GrowthLeagueTag: React.FC<GrowthLeagueTagProps> = ({
  dataTestId,
  value,
  unitMeasure,
}) => {
  const getColorVariant = (value: string | number) => {
    if (value === '-') {
      return {
        background: 'rgba(242, 242, 242, 1)',
        color: 'rgba(130, 143, 155, 1)',
      };
    }

    const numberValue =
      typeof value === 'string' ? Number.parseFloat(value) : value;

    if (numberValue >= 80) {
      return {
        background: 'rgba(230, 249, 230, 1)',
        color: 'rgba(0, 120, 0, 1)',
      };
    }

    if (numberValue >= 60) {
      return {
        background: 'rgba(255, 249, 230, 1)',
        color: 'rgba(135, 106, 0, 1)',
      };
    }

    return {
      background: 'rgba(255, 230, 230, 1)',
      color: 'rgba(186, 11, 11, 1)',
    };
  };

  const { background, color } = getColorVariant(value);

  const formattedValue = value === '-' ? value : formatNumber(Number(value));

  const displayValue = unitMeasure
    ? `${formattedValue}${unitMeasure}`
    : formattedValue;

  return (
    <Tag
      dataTestId={dataTestId ? `${dataTestId}-growth-league` : undefined}
      text={displayValue}
      borderColor={background}
      textColor={color}
      backgroundColor={background}
    />
  );
};

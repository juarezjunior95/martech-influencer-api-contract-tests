import { DatasetPattern, PointStyle } from 'models/ChartData';

import {
  StyledCaption,
  StyledColorIndicator,
  StyledText,
  StyledTextCaption,
} from './Legend.styles';
import { StripedBackground } from './StripedBackground/StripedBackground';

export type FontWeight = 'bold' | 'medium';
export type FontType = 'heading' | 'paragraph';
export type LegendPosition = 'center' | 'left' | 'right';
export type CaptionStyle = 'default' | 'compact';
export type LegendChartType = 'line' | 'bar' | 'extended-bar';
export type PaddingRight = '0' | '12' | '20';

export interface CaptionItem {
  label: string;
  color: string;
  captionType?: LegendChartType;
  pointStyle?: PointStyle;
  fontWeight?: FontWeight;
  paddingRight?: PaddingRight;
  border?: string;
  tooltip?: string;
  disabled?: boolean;
  pattern?: DatasetPattern;
}

interface Props {
  caption: CaptionItem[];
  legendPosition?: LegendPosition;
  font?: FontType;
  fontSize?: 'small' | 'basis' | 'xsmall';
  captionStyle?: CaptionStyle;
  className?: string;
  onClick?: () => void;
  onItemClick?: (item: CaptionItem) => void;
  dataTestId?: string;
}

export const Legend = ({
  caption,
  legendPosition = 'right',
  font = 'paragraph',
  fontSize = 'basis',
  captionStyle = 'default',
  className,
  onClick,
  onItemClick,
  dataTestId,
}: Props) => {
  return (
    <StyledCaption
      legendPosition={legendPosition}
      paddingRight={caption[0]?.paddingRight || '12'}
      captionStyle={captionStyle}
      className={className}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {caption.map((item, index) => (
        <StyledTextCaption
          key={`${item.label}-${index}`}
          color={item.color}
          onClick={() => onItemClick?.(item)}
          style={{
            cursor: onItemClick ? 'pointer' : 'default',
            opacity: item.disabled ? 0.5 : 1,
          }}
          data-testid={dataTestId ? `${dataTestId}-item-${index}` : undefined}
        >
          <StyledColorIndicator
            chartType={item.captionType || 'bar'}
            pointStyle={item.pointStyle || 'square'}
            style={{
              backgroundColor: `${item.color}`,
              border: item.border ? `1px solid ${item.border}` : 'none',
            }}
            data-testid={
              dataTestId ? `${dataTestId}-item-${index}-indicator` : undefined
            }
          >
            {item?.pattern?.type === 'striped' && (
              <StripedBackground
                params={item.pattern.params}
                backgroundColor={item.color}
              />
            )}
          </StyledColorIndicator>
          <StyledText
            fontWeight={item.fontWeight}
            font={font}
            size={fontSize}
            title={item.tooltip}
            data-testid={
              dataTestId ? `${dataTestId}-item-${index}-label` : undefined
            }
          >
            {item.label}
          </StyledText>
        </StyledTextCaption>
      ))}
    </StyledCaption>
  );
};

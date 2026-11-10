import type { FC } from 'react';

import {
  TooltipText,
  TooltipTitle,
} from '../../../CustomTooltip/CustomTooltip.styles';
import {
  Bullet,
  DescriptionBlock,
  TitleRow,
} from './DataTableHeaderTooltipContent.styles';

export interface DataTableHeaderTooltipContentProps {
  title?: string;
  description?: string;
  indicatorColor?: string;
}

export const DataTableHeaderTooltipContent: FC<
  DataTableHeaderTooltipContentProps
> = ({ title, description, indicatorColor }) => {
  const showBullet = Boolean(indicatorColor?.trim());
  const hasTitle = Boolean(title?.trim());
  const desc = description?.trim() ?? '';
  const hasDescription = desc !== '';

  if (!hasTitle && !hasDescription) return null;

  if (hasTitle) {
    return (
      <div>
        <TitleRow>
          {showBullet && indicatorColor && (
            <Bullet $color={indicatorColor} aria-hidden />
          )}
          <TooltipTitle>{title}</TooltipTitle>
        </TitleRow>
        {hasDescription && (
          <DescriptionBlock $indent>
            <TooltipText>{desc}</TooltipText>
          </DescriptionBlock>
        )}
      </div>
    );
  }

  if (hasDescription) {
    if (showBullet && indicatorColor) {
      return (
        <TitleRow $compact>
          <Bullet $color={indicatorColor} aria-hidden />
          <TooltipText>{desc}</TooltipText>
        </TitleRow>
      );
    }
    return <TooltipText>{desc}</TooltipText>;
  }

  return null;
};

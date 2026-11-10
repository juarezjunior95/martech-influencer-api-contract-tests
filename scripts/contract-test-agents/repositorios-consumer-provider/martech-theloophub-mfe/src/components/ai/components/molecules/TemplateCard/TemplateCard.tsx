import { forwardRef } from 'react';

import { cn } from '../../../utils/cn';
import { ArrowRight } from '../../atoms/Icon';
import {
  Arrow,
  Card,
  Content,
  DescLarge,
  DescSmall,
  TitleText,
} from './TemplateCard.styles';
import type { TemplateCardProps } from './TemplateCard.types';

export const TemplateCard = forwardRef<HTMLDivElement, TemplateCardProps>(
  (
    { title, description, onClick, className, variant = 'default', ...props },
    ref,
  ) => {
    const hasTitle = Boolean(title);
    const isClean = variant === 'clean';

    return (
      <Card
        ref={ref}
        $clean={isClean}
        className={cn(className)}
        data-variant={variant}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        {...props}
      >
        <Content>
          {hasTitle && <TitleText>{title}</TitleText>}
          {hasTitle ? (
            <DescSmall data-desc-size="small">{description}</DescSmall>
          ) : (
            <DescLarge data-desc-size="large">{description}</DescLarge>
          )}
        </Content>
        <Arrow>
          <ArrowRight size={16} />
        </Arrow>
      </Card>
    );
  },
);

TemplateCard.displayName = 'TemplateCard';

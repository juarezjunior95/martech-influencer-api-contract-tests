import type { ReactNode } from 'react';

import { Button } from '../../atoms/Button';
import {
  ButtonWrapper,
  Container,
  Description,
  IconWrapper,
  Title,
} from './EmptyState.styles';

export type EmptyStateVariant = 'default' | 'compact';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  loading?: boolean;
  variant?: EmptyStateVariant;
}

export const EmptyState = ({
  icon,
  title,
  description,
  onRetry,
  retryLabel = 'Try Again',
  loading = false,
  variant = 'default',
}: EmptyStateProps) => {
  return (
    <Container variant={variant}>
      <IconWrapper>{icon}</IconWrapper>
      <Title variant={variant}>{title}</Title>
      <Description>{description}</Description>
      {onRetry && (
        <ButtonWrapper variant={variant}>
          <Button variant="primary" onClick={onRetry} loading={loading}>
            {retryLabel}
          </Button>
        </ButtonWrapper>
      )}
    </Container>
  );
};

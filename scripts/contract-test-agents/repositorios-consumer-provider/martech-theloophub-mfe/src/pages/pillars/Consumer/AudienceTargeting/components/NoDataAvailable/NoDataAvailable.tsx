import { ReactNode } from 'react';

import { DATA_NOT_AVAILABLE } from './constants';
import {
  StyledActionsWrapper,
  StyledDescription,
  StyledIconWrapper,
  StyledNoDataCard,
  StyledNoDataContainer,
  StyledTitle,
} from './NoDataAvailable.styles';

export interface NoDataAvailableAction {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface NoDataAvailableProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  actions?: NoDataAvailableAction[];
  dataTestId?: string;
}

export const NoDataAvailable = ({
  icon,
  title = DATA_NOT_AVAILABLE,
  description,
  actions,
  dataTestId,
}: NoDataAvailableProps) => {
  return (
    <StyledNoDataCard data-testid={dataTestId}>
      <StyledNoDataContainer
        data-testid={dataTestId ? `${dataTestId}-no-data` : undefined}
      >
        {icon && <StyledIconWrapper>{icon}</StyledIconWrapper>}

        <StyledTitle>{title}</StyledTitle>

        {description && <StyledDescription>{description}</StyledDescription>}

        {actions && actions.length > 0 && (
          <StyledActionsWrapper>
            {actions.map(({ id, label, onClick, variant = 'secondary' }) => (
              <button
                key={id}
                onClick={onClick}
                data-variant={variant}
                data-testid={
                  dataTestId ? `${dataTestId}-action-${id}` : undefined
                }
              >
                {label}
              </button>
            ))}
          </StyledActionsWrapper>
        )}
      </StyledNoDataContainer>
    </StyledNoDataCard>
  );
};

import { ReactNode } from 'react';

import { StyledSectionTitle } from 'shared/Styles';

import { StyledPOSHeaderContainer } from '../../POSBook.styles';
import {
  StyledSubfiltersGroup,
  StyledTableHeaderContainer,
  StyledTableLastRefresh,
} from './TableHeader.styles';

interface TableHeaderProps {
  title: string;
  lastDataRefresh?: string;

  filters?: ReactNode;
  rightContent?: ReactNode;
  dataTestId?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  lastDataRefresh,
  filters,
  rightContent,
  dataTestId,
}) => {
  return (
    <StyledPOSHeaderContainer
      data-testid={dataTestId ? `table-header-${dataTestId}` : undefined}
    >
      <StyledTableHeaderContainer>
        <StyledSectionTitle
          data-testid={dataTestId ? `table-title-${dataTestId}` : undefined}
        >
          {title}
        </StyledSectionTitle>
        {lastDataRefresh && (
          <StyledTableLastRefresh
            data-testid={dataTestId ? `table-refresh-${dataTestId}` : undefined}
          >{`[ vs ${lastDataRefresh} ]`}</StyledTableLastRefresh>
        )}
        {rightContent}
      </StyledTableHeaderContainer>
      <StyledSubfiltersGroup
        data-testid={dataTestId ? `table-filters-${dataTestId}` : undefined}
      >
        {filters}
      </StyledSubfiltersGroup>
    </StyledPOSHeaderContainer>
  );
};

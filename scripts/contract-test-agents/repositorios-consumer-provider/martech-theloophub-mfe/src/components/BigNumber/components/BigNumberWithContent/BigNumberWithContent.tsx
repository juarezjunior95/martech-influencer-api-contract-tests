import { buildDataTestId } from 'utils';

import { BigNumber, BigNumberProps } from '../../BigNumber';
import {
  StyledBigNumberSection,
  StyledBigNumberWithContentCard,
  StyledBody,
  StyledContentSection,
  StyledHeader,
} from './BigNumberWithContent.styles';

export interface BigNumberWithContentProps extends Pick<
  BigNumberProps,
  | 'data'
  | 'emptyStateMessage'
  | 'emptyStateConfig'
  | 'dataTestId'
  | 'header'
  | 'onClick'
  | 'isSelected'
  | 'fullWidth'
  | 'size'
> {
  children?: React.ReactNode;
}

export const BigNumberWithContent = ({
  header,
  data,
  onClick,
  isSelected,
  emptyStateMessage,
  emptyStateConfig,
  dataTestId,
  children,
  size = 'large',
  fullWidth = false,
}: BigNumberWithContentProps) => {
  const hasData = data.length > 0;
  const isClickable = !!onClick && hasData;
  const BASE_TEST_ID = 'big-number-with-content';

  return (
    <StyledBigNumberWithContentCard
      border="medium"
      elevated="medium"
      clickeable={isClickable}
      fullWidth={fullWidth}
      onClick={isClickable ? onClick : undefined}
      className={[isSelected ? 'selected' : '', 'bigNumberwithContentCard']
        .filter(Boolean)
        .join(' ')}
      data-testid={buildDataTestId(BASE_TEST_ID, dataTestId)}
    >
      {header && (
        <StyledHeader
          data-testid={buildDataTestId(BASE_TEST_ID, dataTestId, 'header')}
        >
          {header}
        </StyledHeader>
      )}

      <StyledBody
        data-testid={buildDataTestId(BASE_TEST_ID, dataTestId, 'body')}
        fullWidth={fullWidth}
      >
        <StyledBigNumberSection
          data-testid={buildDataTestId(BASE_TEST_ID, dataTestId, 'bignumber')}
          fullWidth={fullWidth}
        >
          <BigNumber
            data={data}
            orientation="vertical"
            emptyStateMessage={emptyStateMessage}
            emptyStateConfig={emptyStateConfig}
            size={size}
          />
        </StyledBigNumberSection>

        {children && (
          <StyledContentSection
            data-testid={buildDataTestId(BASE_TEST_ID, dataTestId, 'content')}
            fullWidth={fullWidth}
          >
            {children}
          </StyledContentSection>
        )}
      </StyledBody>
    </StyledBigNumberWithContentCard>
  );
};

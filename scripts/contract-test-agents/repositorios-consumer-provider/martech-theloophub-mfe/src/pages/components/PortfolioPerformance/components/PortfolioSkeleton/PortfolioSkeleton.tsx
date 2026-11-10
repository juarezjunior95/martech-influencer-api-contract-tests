import { Fragment } from 'react';

import { SkeletonLoader } from '@hexa-ui/components';

import { tableWidths } from '../../constants';
import { StyledContent } from './PortfolioSkeleton.styles';

interface PortfolioSkeletonProps {
  dataTestId?: string;
}

const COLUMN_WIDTHS = [180, 144, 117, 90];

export const PortfolioSkeleton: React.FC<PortfolioSkeletonProps> = ({
  dataTestId,
}) => {
  return (
    <output
      aria-busy="true"
      aria-label="Loading portfolio performance"
      data-testid={dataTestId}
      style={{ display: 'block' }}
    >
      <StyledContent style={{ marginBottom: '16px' }}>
        {tableWidths.map((width) => (
          <SkeletonLoader
            key={`portfolio-skeleton-row1-${width}`}
            height="111px"
            variant="body"
            width={width}
          />
        ))}
      </StyledContent>

      <StyledContent>
        {tableWidths.map((width, index) => (
          <Fragment key={`portfolio-skeleton-row2-${width}`}>
            {index === 0 ? (
              <div
                style={{
                  display: 'flex',
                  rowGap: '8px',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                {COLUMN_WIDTHS.map((columnWidth) => (
                  <SkeletonLoader
                    key={`portfolio-skeleton-col-${columnWidth}`}
                    height="89px"
                    variant="body"
                    width={`${columnWidth}px`}
                  />
                ))}
              </div>
            ) : (
              <SkeletonLoader height="392px" variant="body" width={width} />
            )}
          </Fragment>
        ))}
      </StyledContent>
    </output>
  );
};

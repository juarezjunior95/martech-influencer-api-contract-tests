import { useIntl } from 'react-intl';

import {
  CategoryOverview,
  CategoryOverviewInterface,
  ErrorMessage,
  Skeleton,
} from 'components';
import { useIsInExportPage } from 'hooks';

import { StyledContent } from './CategoryGrowthLevers.styles';

interface CategoryGrowthLeversProps {
  data: CategoryOverviewInterface[] | { empty: boolean };
  error: Error | null;
  loading: boolean;
  tooltip?: boolean;
  dataTestId?: string;
}

const formatTitleToKebabCase = (title: string): string => {
  return title.toLowerCase().replaceAll(/\s+/g, '-');
};

export const CategoryGrowthLevers: React.FC<CategoryGrowthLeversProps> = ({
  data,
  error,
  loading,
  tooltip = true,
  dataTestId,
}) => {
  const isExportPage = useIsInExportPage();
  const { formatMessage } = useIntl();

  if (loading) {
    return (
      <Skeleton
        height="168px"
        width={isExportPage ? '311px' : '241px'}
        length={5}
        gap="medium"
        data-testid={dataTestId ? `skeleton-${dataTestId}` : undefined}
      />
    );
  }

  if (error || !data || data['empty']) {
    return (
      <ErrorMessage
        data-testid={dataTestId ? `error-${dataTestId}` : undefined}
      />
    );
  }

  return (
    <StyledContent data-testid={dataTestId}>
      {(data as CategoryOverviewInterface[]).map((item, index) => (
        <CategoryOverview
          key={`${item.title}-${index}`}
          data={{
            ...item,
            tooltip:
              tooltip &&
              formatMessage({
                id: `PortfolioBrand.PortfolioPerformance.CategoryGrowthLevers.Kpi.tooltip.${item.title}`,
                defaultMessage: '',
              }),
          }}
          dataTestId={
            dataTestId
              ? `card-${dataTestId}-${formatTitleToKebabCase(item.title)}`
              : undefined
          }
        />
      ))}
    </StyledContent>
  );
};

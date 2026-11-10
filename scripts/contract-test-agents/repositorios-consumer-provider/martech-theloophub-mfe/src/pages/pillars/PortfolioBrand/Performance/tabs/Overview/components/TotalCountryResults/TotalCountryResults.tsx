import { ErrorMessage, Skeleton } from 'components';
import { BigNumberData } from 'components/deprecated';

import { StyledContent } from '../../Overview.styles';
import { BigNumberItem } from '../BigNumberItem/BigNumberItem';

interface TotalCountryResultsProps {
  data: BigNumberData[] | { empty: boolean };
  error: Error | null;
  loading: boolean;
  dataTestId?: string;
}

export const TotalCountryResults: React.FC<TotalCountryResultsProps> = ({
  data,
  error,
  loading,
  dataTestId,
}) => {
  if (loading) {
    return (
      <Skeleton
        dataTestId={
          dataTestId ? `${dataTestId}-total-country-results` : undefined
        }
        height="168px"
        width="241px"
        length={5}
        gap="medium"
      />
    );
  }

  if (error || data['empty']) {
    return (
      <ErrorMessage
        dataTestId={
          dataTestId ? `${dataTestId}-total-country-results-error` : undefined
        }
      />
    );
  }

  if (!data) return null;

  return (
    <StyledContent
      data-testid={
        dataTestId ? `${dataTestId}-total-country-results-content` : undefined
      }
    >
      {(data as BigNumberData[]).map((item) => {
        return (
          <BigNumberItem
            dataTestId={
              dataTestId ? `${dataTestId}-total-country-results` : undefined
            }
            key={item.title}
            item={{
              ...item,
            }}
          />
        );
      })}
    </StyledContent>
  );
};

import NoDataYet from 'components/NoDataYet/NoDataYet';

import { NoDataAvailableContainer } from './NoDataAvailable.styles';

interface NoDataAvailableProps {
  dataTestId?: string;
}

export const NoDataAvailable: React.FC<NoDataAvailableProps> = ({
  dataTestId,
}) => {
  return (
    <NoDataAvailableContainer
      data-testid={dataTestId ? `${dataTestId}-no-data-available` : undefined}
    >
      <NoDataYet
        dataTestId={
          dataTestId ? `${dataTestId}-no-data-available-content` : undefined
        }
      />
    </NoDataAvailableContainer>
  );
};

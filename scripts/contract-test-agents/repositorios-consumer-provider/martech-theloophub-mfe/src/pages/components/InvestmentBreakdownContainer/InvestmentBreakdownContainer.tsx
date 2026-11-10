import { Legend, NoDataYet, NoResultsState, Skeleton } from 'components';
import { FILTER_MODAL_NAME } from 'components/Filter';
import { TableDataType } from 'components/Table/types';
import { useScopedModal } from 'contexts/Modal/ModalContext';
import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { WithEmpty } from 'utils/dataEmpty';

import { LEGEND_CONFIG } from '../../constants';
import { InvestmentBreakdownTable } from './components/InvestmentBreakdownTable/InvestmentBreakdownTable';
import { StyledLegendContainer } from './InvestmentBreakdownContainer.styles';

interface InvestmentBreakdownContainerProps {
  data: WithEmpty<TableDataType>;
  loading: boolean;
  legend?: boolean;
  dataTestId?: string;
}

export const InvestmentBreakdownContainer: React.FC<
  InvestmentBreakdownContainerProps
> = ({ data, loading, legend = true, dataTestId }) => {
  const { currentPage } = useCurrentPage();
  const { isGlobalZone } = usePageFilterApplied(currentPage);
  const { open: openModal } = useScopedModal(FILTER_MODAL_NAME);

  if (isGlobalZone) {
    return (
      <NoResultsState
        type={'investmentBreakdown'}
        openModal={openModal}
        headerTitleId="ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.noCountrySelectedTitle"
        descriptionId="ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.noCountrySelectedDescription"
        buttonTextId="ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.selectACountry"
        dataTestId={dataTestId ? `${dataTestId}-no-results` : undefined}
      />
    );
  }

  if (loading) {
    return (
      <Skeleton
        height="590px"
        width="1280px"
        length={1}
        data-testid={dataTestId ? `skeleton-${dataTestId}` : undefined}
      />
    );
  }

  if (!data || data.empty) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center' }}
        data-testid={dataTestId ? `no-data-${dataTestId}` : undefined}
      >
        <NoDataYet />
      </div>
    );
  }

  return (
    <>
      <StyledLegendContainer>
        {legend && (
          <Legend
            legendPosition="left"
            caption={LEGEND_CONFIG.map((item) => ({
              ...item,
              pointStyle: 'roundedThicker',
            }))}
            dataTestId={dataTestId ? `${dataTestId}-legend` : undefined}
          />
        )}
      </StyledLegendContainer>
      <InvestmentBreakdownTable
        data={data}
        dataTestId={dataTestId ? `${dataTestId}-table` : undefined}
      />
    </>
  );
};

import { useIntl } from 'react-intl';

import { Heading, SegmentedControl } from '@hexa-ui/components';
import { BarChart2 } from '@hexa-ui/icons2';
import { SubFilter } from 'components';

import {
  RA_DEEP_DIVE_SUBFILTER,
  RA_DEEP_DIVE_SUBFILTER_PRESET,
  VIEW_TYPES,
} from '../../constants';
import {
  StyledDeepDiveFilters,
  StyledDeepDiveHeaderContainer,
} from './DeepDiveHeader.styles';

interface DeepDiveHeaderProps {
  selectedView: string;
  onViewChange: (view: string) => void;
  isBreakdownViewer: boolean;
  dataTestId?: string;
}

const DeepDiveHeader = ({
  selectedView,
  onViewChange,
  isBreakdownViewer,
  dataTestId,
}: DeepDiveHeaderProps) => {
  const { formatMessage } = useIntl();

  const options = [
    {
      value: VIEW_TYPES.BREAKDOWN,
      label: formatMessage({
        id: `ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.breakdown_toggle`,
      }),
    },
    {
      value: VIEW_TYPES.RANKING,
      label: formatMessage({
        id: `ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.ranking_toggle`,
      }),
    },
  ];

  const sortedOptions = isBreakdownViewer ? options : [...options].reverse();

  return (
    <StyledDeepDiveHeaderContainer
      data-testid={
        dataTestId ? `${dataTestId}-deep-dive-header-container` : undefined
      }
    >
      <Heading
        size="H3"
        data-testid={
          dataTestId ? `${dataTestId}-deep-dive-header-title` : undefined
        }
      >
        {formatMessage({
          id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.title',
        })}
      </Heading>
      <StyledDeepDiveFilters
        data-testid={
          dataTestId ? `${dataTestId}-deep-dive-header-filters` : undefined
        }
      >
        <SubFilter.Select
          name="kpis"
          apiKey={RA_DEEP_DIVE_SUBFILTER_PRESET}
          stateKey={RA_DEEP_DIVE_SUBFILTER}
          dataApiKey="kpis"
          params={{}}
          icon={BarChart2}
          dataTestId={
            dataTestId ? `${dataTestId}-deep-dive-header-select` : undefined
          }
        />
        <SegmentedControl
          options={sortedOptions}
          onValueChange={onViewChange}
          value={selectedView}
          data-testid={
            dataTestId
              ? `${dataTestId}-deep-dive-header-segmented-control`
              : undefined
          }
        />
      </StyledDeepDiveFilters>
    </StyledDeepDiveHeaderContainer>
  );
};

export default DeepDiveHeader;

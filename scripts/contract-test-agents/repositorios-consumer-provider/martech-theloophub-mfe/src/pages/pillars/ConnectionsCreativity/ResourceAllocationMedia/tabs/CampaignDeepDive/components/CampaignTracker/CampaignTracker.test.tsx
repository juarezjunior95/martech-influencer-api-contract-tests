import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';

import { CampaignTracker } from './CampaignTracker';

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, size, 'data-testid': dataTestId }: any) => (
    <h5 data-testid={dataTestId ?? 'heading'} data-size={size}>
      {children}
    </h5>
  ),
}));

jest.mock('components', () => ({
  ChartLegend: ({ items, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'chart-legend'}
      data-items={JSON.stringify(items)}
    />
  ),
  Table: ({
    data,
    headerHeight,
    columnDefsConfig,
    getRowHeightCallback,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId ?? 'table'}
      data-data={JSON.stringify(data)}
      data-header-height={headerHeight}
      data-column-defs-config={JSON.stringify(columnDefsConfig)}
      data-has-row-height-callback={!!getRowHeightCallback}
    />
  ),
}));

jest.mock('../../config/tableConfig/tableConfig', () => ({
  configs: [{ field: 'col1' }, { field: 'col2' }],
}));

jest.mock('../../constants', () => ({
  CAMPAIGN_TRACKER_LEGEND: [{ label: 'Legend 1', color: '#000' }],
}));

jest.mock('../../utils/utils', () => ({
  getRowHeightCallback: jest.fn(),
}));

jest.mock('./CampaignTracker.styles', () => ({
  StyledCampaignTrackerContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid'] ?? 'campaign-tracker-container'}>
      {children}
    </div>
  ),
  StyledCampaignTrackerHeading: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid'] ?? 'campaign-tracker-heading'}>
      {children}
    </div>
  ),
  StyledCampaignTrackerLegend: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid'] ?? 'campaign-tracker-legend'}>
      {children}
    </div>
  ),
  StyledCampaignTrackerTable: { width: '100%' },
}));

describe('CampaignTracker', () => {
  const mockFormatMessage = jest.fn(({ id }) => id);
  const mockTableData = {
    headers: ['col1', 'col2'],
    rows: [{ col1: 'value1', col2: 'value2' }],
  } as unknown as TableDataType;

  const mockConfigs = [{ field: 'col1' }, { field: 'col2' }];
  const mockLegend = [{ label: 'Legend 1', color: '#000' }];

  const defaultProps = {
    formatMessage: mockFormatMessage,
    table: mockTableData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) => {
    return render(<CampaignTracker {...defaultProps} {...overrideProps} />);
  };

  describe('Heading', () => {
    it('renders Heading with size H5 and calls formatMessage correctly', () => {
      renderComponent();

      const heading = screen.getByTestId('heading');
      expect(heading).toHaveAttribute('data-size', 'H5');
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.CampaignDeepDiveTab.CampaignsPerformance.campaignTracker.title',
      });
    });

    it('renders the formatted message as heading content', () => {
      const translatedText = 'Campaign Tracker Title';
      mockFormatMessage.mockReturnValue(translatedText);

      renderComponent();

      expect(screen.getByTestId('heading')).toHaveTextContent(translatedText);
    });
  });

  describe('Table', () => {
    it('renders Table with correct props', () => {
      renderComponent();

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-data', JSON.stringify(mockTableData));
      expect(table).toHaveAttribute('data-header-height', '56');
      expect(table).toHaveAttribute(
        'data-column-defs-config',
        JSON.stringify(mockConfigs),
      );
      expect(table).toHaveAttribute('data-has-row-height-callback', 'true');
    });
  });

  describe('ChartLegend', () => {
    it('renders ChartLegend with correct items', () => {
      renderComponent();

      const legend = screen.getByTestId('chart-legend');
      expect(legend).toHaveAttribute('data-items', JSON.stringify(mockLegend));
    });
  });

  describe('Data scenarios', () => {
    it.each([
      ['empty table data', { headers: [], rows: [] }],
      [
        'table with multiple rows',
        {
          headers: ['col1', 'col2'],
          rows: [
            { col1: 'value1', col2: 'value2' },
            { col1: 'value3', col2: 'value4' },
            { col1: 'value5', col2: 'value6' },
          ],
        },
      ],
    ])('handles %s', (_, tableData) => {
      renderComponent({ table: tableData as unknown as TableDataType });

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-data', JSON.stringify(tableData));
    });
  });

  describe('data-testid Rendering', () => {
    it('renders custom data-testid when dataTestId is provided', () => {
      renderComponent({ dataTestId: 'tracker' });

      screen.getByTestId('campaign-tracker-tracker');
      const headingElements = screen.getAllByTestId(
        'campaign-tracker-heading-tracker',
      );
      expect(headingElements.length).toBeGreaterThanOrEqual(1);
      screen.getByTestId('campaign-tracker-legend-tracker');
      const trackerElements = screen.getAllByTestId('tracker-campaign-tracker');
      expect(trackerElements.length).toBeGreaterThanOrEqual(1);
    });

    it('does not render custom data-testid when dataTestId is not provided', () => {
      renderComponent();

      expect(screen.queryByTestId('campaign-tracker-')).not.toBeInTheDocument();
      screen.getByTestId('campaign-tracker-container');
      screen.getByTestId('campaign-tracker-heading');
      screen.getByTestId('campaign-tracker-legend');
    });
  });
});

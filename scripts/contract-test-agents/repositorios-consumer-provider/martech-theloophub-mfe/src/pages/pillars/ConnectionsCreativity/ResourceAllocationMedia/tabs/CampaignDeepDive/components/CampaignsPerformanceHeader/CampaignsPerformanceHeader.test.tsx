import { render, screen } from '@testing-library/react';

import { CampaignsPerformanceHeader } from './CampaignsPerformanceHeader';

jest.mock('@hexa-ui/components', () => ({
  Heading: jest.fn(
    ({ children, size, 'data-testid': dataTestId, ...props }: any) => (
      <h3 data-testid={dataTestId ?? 'heading'} data-size={size} {...props}>
        {children}
      </h3>
    ),
  ),
}));

describe('CampaignsPerformanceHeader', () => {
  const mockFormatMessage = jest.fn(({ id }) => id);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Heading with size H3 and calls formatMessage correctly', () => {
    render(<CampaignsPerformanceHeader formatMessage={mockFormatMessage} />);

    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-size', 'H3');
    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'ConnectionsCreativity.ResourceAllocationMedia.CampaignDeepDiveTab.CampaignsPerformance.title',
    });
    expect(mockFormatMessage).toHaveBeenCalledTimes(1);
  });

  it('renders the formatted message as heading content', () => {
    const translatedText = 'Campaigns Performance Title';
    mockFormatMessage.mockReturnValue(translatedText);

    render(<CampaignsPerformanceHeader formatMessage={mockFormatMessage} />);

    expect(screen.getByTestId('heading')).toHaveTextContent(translatedText);
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(
        <CampaignsPerformanceHeader
          formatMessage={mockFormatMessage}
          dataTestId="campaigns-header"
        />,
      );

      expect(
        screen.getByTestId('campaigns-performance-header-campaigns-header'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<CampaignsPerformanceHeader formatMessage={mockFormatMessage} />);

      expect(
        screen.queryByTestId('campaigns-performance-header-'),
      ).not.toBeInTheDocument();
      screen.getByTestId('heading');
    });
  });
});

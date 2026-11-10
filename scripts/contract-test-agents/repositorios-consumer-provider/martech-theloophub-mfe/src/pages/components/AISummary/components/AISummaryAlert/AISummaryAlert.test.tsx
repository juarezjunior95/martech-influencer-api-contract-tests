import { render, screen } from '@testing-library/react';

import { AISummaryAlert } from './AISummaryAlert';

const mockUseAISummaryData = jest.fn();
const mockFormatMessage = jest.fn((msg: { id: string }) => {
  const messages: Record<string, string> = {
    'AISummaryAlert.MainPages.seeMore': 'See More',
    'AISummaryAlert.MainPages.seeLess': 'See Less',
  };
  return messages[msg.id] ?? msg.id;
});

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: mockFormatMessage }),
}));

jest.mock('../../hooks/useAISummaryData/useAISummaryData', () => ({
  useAISummaryData: (...args: unknown[]) => mockUseAISummaryData(...args),
}));

jest.mock('components/ai/components/atoms/MarkdownRenderer', () => ({
  MarkdownRenderer: ({ content }: { content: string }) => (
    <span data-testid="markdown-renderer">{content}</span>
  ),
}));

jest.mock('components/Skeleton', () => ({
  Skeleton: (props: any) => (
    <div data-testid={props['data-testid']}>Skeleton</div>
  ),
  SkeletonBorderRadius: {},
}));

jest.mock('components/Alert', () => ({
  Alert: ({ type, message, expandedAction, dataTestId }: any) => (
    <div data-testid={dataTestId} data-type={type}>
      <div data-testid={`${dataTestId}-message`}>{message}</div>
      {expandedAction && (
        <div data-testid={`${dataTestId}-expanded-action`}>
          <span>{expandedAction.actionMessage}</span>
          <div data-testid={`${dataTestId}-expanded-message`}>
            {expandedAction.expandedMessage}
          </div>
        </div>
      )}
    </div>
  ),
}));

jest.mock('./AISummaryAlert.styles', () => ({
  StyledSummaryContainer: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
}));

describe('AISummaryAlert', () => {
  const defaultPageName = 'test-page';
  const defaultSummaryPageIdentifier = 'pillar/page/tab';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAISummaryData.mockReturnValue({
      summary: { resume: 'Default summary', seeMore: null },
      loading: false,
      alertType: 'info',
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      mockUseAISummaryData.mockReturnValue({
        summary: { resume: null, seeMore: null },
        loading: true,
        alertType: 'info',
      });
    });

    it('should render skeleton when loading', () => {
      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.getByTestId(`skeleton-ai-summary-${defaultPageName}-loading`),
      ).toBeInTheDocument();
    });

    it('should not render alert when loading', () => {
      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.queryByTestId(`alert-${defaultPageName}`),
      ).not.toBeInTheDocument();
    });

    it('should render skeleton with custom dataTestId when loading', () => {
      render(
        <AISummaryAlert
          pageName={defaultPageName}
          dataTestId="custom"
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.getByTestId('custom-skeleton-ai-summary-loading'),
      ).toBeInTheDocument();
    });
  });

  describe('Error / Empty State', () => {
    it('should render empty summary message when data has empty flag', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: {
          resume: 'Failed to generate AI insights.',
          seeMore: null,
          empty: true,
        },
        loading: false,
        alertType: 'neutral',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.getByTestId(`alert-${defaultPageName}`),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Failed to generate AI insights.'),
      ).toBeInTheDocument();
    });
  });

  describe('With Summary Data', () => {
    it('should render alert with resume content', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: {
          resume: 'AI generated summary',
          seeMore: null,
        },
        loading: false,
        alertType: 'info',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.getByTestId(`alert-${defaultPageName}`),
      ).toBeInTheDocument();
      expect(screen.getByText('AI generated summary')).toBeInTheDocument();
    });

    it('should render expandedAction when seeMore is available', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: {
          resume: 'Summary text',
          seeMore: 'Detailed content here',
        },
        loading: false,
        alertType: 'info',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.getByTestId(`alert-${defaultPageName}-expanded-action`),
      ).toBeInTheDocument();
      expect(
        screen.getByText('AISummary.MainPages.seeMore'),
      ).toBeInTheDocument();
      expect(screen.getByText('Detailed content here')).toBeInTheDocument();
    });

    it('should not render expandedAction when seeMore is null', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: {
          resume: 'Summary text',
          seeMore: null,
        },
        loading: false,
        alertType: 'info',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.queryByTestId(`alert-${defaultPageName}-expanded-action`),
      ).not.toBeInTheDocument();
    });

    it('should render resume using MarkdownRenderer', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: {
          resume: '**Bold text**',
          seeMore: null,
        },
        loading: false,
        alertType: 'info',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      const renderers = screen.getAllByTestId('markdown-renderer');
      expect(renderers[0]).toHaveTextContent('**Bold text**');
    });

    it('should render seeMore using MarkdownRenderer', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: {
          resume: 'Summary',
          seeMore: '## Detailed info',
        },
        loading: false,
        alertType: 'info',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      const renderers = screen.getAllByTestId('markdown-renderer');
      expect(renderers).toHaveLength(2);
      expect(renderers[1]).toHaveTextContent('## Detailed info');
    });
  });

  describe('Alert Type', () => {
    it('should set alert type to "neutral" when hook returns neutral', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: { resume: 'Empty summary', seeMore: null, empty: true },
        loading: false,
        alertType: 'neutral',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(screen.getByTestId(`alert-${defaultPageName}`)).toHaveAttribute(
        'data-type',
        'neutral',
      );
    });

    it('should set alert type to "info" when hook returns info', () => {
      mockUseAISummaryData.mockReturnValue({
        summary: { resume: 'Summary', seeMore: null },
        loading: false,
        alertType: 'info',
      });

      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(screen.getByTestId(`alert-${defaultPageName}`)).toHaveAttribute(
        'data-type',
        'info',
      );
    });
  });

  describe('dataTestId Prop', () => {
    it('should use default data-testid based on pageName for the container', () => {
      render(
        <AISummaryAlert
          pageName="volume"
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(screen.getByTestId('ai-summary-volume')).toBeInTheDocument();
    });

    it('should use custom data-testid for the container when dataTestId is provided', () => {
      render(
        <AISummaryAlert
          pageName="volume"
          dataTestId="custom"
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(
        screen.getByTestId('custom-ai-summary-content'),
      ).toBeInTheDocument();
    });

    it('should use default data-testid for alert based on pageName', () => {
      render(
        <AISummaryAlert
          pageName="volume"
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(screen.getByTestId('alert-volume')).toBeInTheDocument();
    });

    it('should use custom data-testid for alert when dataTestId is provided', () => {
      render(
        <AISummaryAlert
          pageName="volume"
          dataTestId="custom"
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should pass props to useAISummaryData', () => {
      const subFilters = { cohort: 'All', price_segment: 'Premium Co' };

      render(
        <AISummaryAlert
          pageName="my-page"
          kpiGroup="volume"
          subFilters={subFilters}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(mockUseAISummaryData).toHaveBeenCalledWith({
        pageName: 'my-page',
        kpiGroup: 'volume',
        subFilters,
        summaryPageIdentifier: defaultSummaryPageIdentifier,
      });
    });

    it('should pass undefined kpiGroup when not provided', () => {
      render(
        <AISummaryAlert
          pageName={defaultPageName}
          summaryPageIdentifier={defaultSummaryPageIdentifier}
        />,
      );

      expect(mockUseAISummaryData).toHaveBeenCalledWith(
        expect.objectContaining({ kpiGroup: undefined }),
      );
    });
  });
});

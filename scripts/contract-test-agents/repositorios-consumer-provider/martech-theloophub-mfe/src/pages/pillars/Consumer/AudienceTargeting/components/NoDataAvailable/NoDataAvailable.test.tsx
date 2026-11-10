import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NoDataAvailable } from './NoDataAvailable';

jest.mock('./NoDataAvailable.styles', () => ({
  StyledNoDataCard: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId}>{children}</div>,
  StyledNoDataContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId}>{children}</div>,
  StyledIconWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="icon-wrapper">{children}</div>
  ),
  StyledTitle: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="no-data-title">{children}</p>
  ),
  StyledDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="no-data-description">{children}</p>
  ),
  StyledActionsWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="no-data-actions">{children}</div>
  ),
}));

jest.mock('./constants', () => ({
  DATA_NOT_AVAILABLE: 'DATA NOT AVAILABLE',
}));

describe('NoDataAvailable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default rendering', () => {
    test('should render with default title when no props are passed', () => {
      render(<NoDataAvailable />);

      expect(screen.getByTestId('no-data-title')).toHaveTextContent(
        'DATA NOT AVAILABLE',
      );
    });

    test('should not render icon when icon prop is omitted', () => {
      render(<NoDataAvailable />);

      expect(screen.queryByTestId('icon-wrapper')).not.toBeInTheDocument();
    });

    test('should not render description when description prop is omitted', () => {
      render(<NoDataAvailable />);

      expect(
        screen.queryByTestId('no-data-description'),
      ).not.toBeInTheDocument();
    });

    test('should not render actions when actions prop is omitted', () => {
      render(<NoDataAvailable />);

      expect(screen.queryByTestId('no-data-actions')).not.toBeInTheDocument();
    });
  });

  describe('dataTestId', () => {
    test('should apply dataTestId to the card element', () => {
      render(<NoDataAvailable dataTestId="empty-state-audience" />);

      expect(screen.getByTestId('empty-state-audience')).toBeInTheDocument();
    });

    test('should apply dataTestId with -no-data suffix to the container', () => {
      render(<NoDataAvailable dataTestId="empty-state-audience" />);

      expect(
        screen.getByTestId('empty-state-audience-no-data'),
      ).toBeInTheDocument();
    });

    test('should not apply data-testid when dataTestId is omitted', () => {
      const { container } = render(<NoDataAvailable />);

      const elementsWithTestId = container.querySelectorAll('[data-testid]');
      const testIds = Array.from(elementsWithTestId).map((el) =>
        el.getAttribute('data-testid'),
      );

      expect(testIds).not.toContain('undefined');
    });
  });

  describe('Title', () => {
    test('should render custom title', () => {
      render(<NoDataAvailable title="No Audience Data Available" />);

      expect(screen.getByTestId('no-data-title')).toHaveTextContent(
        'No Audience Data Available',
      );
    });

    test('should always render the title element', () => {
      render(<NoDataAvailable />);

      expect(screen.getByTestId('no-data-title')).toBeInTheDocument();
    });
  });

  describe('Description', () => {
    test('should render description when provided', () => {
      render(
        <NoDataAvailable description="Consumer data for Brazil is not available." />,
      );

      expect(screen.getByTestId('no-data-description')).toHaveTextContent(
        'Consumer data for Brazil is not available.',
      );
    });

    test('should not render description element when not provided', () => {
      render(<NoDataAvailable />);

      expect(
        screen.queryByTestId('no-data-description'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Icon', () => {
    test('should render icon when provided', () => {
      render(
        <NoDataAvailable icon={<img src="search.svg" alt="no data icon" />} />,
      );

      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument();
      expect(screen.getByAltText('no data icon')).toBeInTheDocument();
    });

    test('should not render icon wrapper when icon is not provided', () => {
      render(<NoDataAvailable />);

      expect(screen.queryByTestId('icon-wrapper')).not.toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    const actions = [
      { id: 'reset-filters', label: 'Reset Filters', onClick: jest.fn() },
      { id: 'return-to-home', label: 'Return to Home', onClick: jest.fn() },
    ];

    test('should render action buttons when actions are provided', () => {
      render(<NoDataAvailable actions={actions} />);

      expect(
        screen.getByRole('button', { name: 'Reset Filters' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Return to Home' }),
      ).toBeInTheDocument();
    });

    test('should not render actions wrapper when actions array is empty', () => {
      render(<NoDataAvailable actions={[]} />);

      expect(screen.queryByTestId('no-data-actions')).not.toBeInTheDocument();
    });

    test('should not render actions wrapper when actions prop is omitted', () => {
      render(<NoDataAvailable />);

      expect(screen.queryByTestId('no-data-actions')).not.toBeInTheDocument();
    });

    test('should call onClick when first action button is clicked', async () => {
      const user = userEvent.setup();
      render(<NoDataAvailable actions={actions} />);

      await user.click(screen.getByRole('button', { name: 'Reset Filters' }));

      expect(actions[0].onClick).toHaveBeenCalledTimes(1);
    });

    test('should call onClick when second action button is clicked', async () => {
      const user = userEvent.setup();
      render(<NoDataAvailable actions={actions} />);

      await user.click(screen.getByRole('button', { name: 'Return to Home' }));

      expect(actions[1].onClick).toHaveBeenCalledTimes(1);
    });

    test('should apply dataTestId to each action button', () => {
      render(
        <NoDataAvailable dataTestId="empty-state-audience" actions={actions} />,
      );

      expect(
        screen.getByTestId('empty-state-audience-action-reset-filters'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('empty-state-audience-action-return-to-home'),
      ).toBeInTheDocument();
    });

    test('should not apply data-testid to action buttons when dataTestId is omitted', () => {
      render(<NoDataAvailable actions={actions} />);

      expect(
        screen.queryByTestId('undefined-action-reset-filters'),
      ).not.toBeInTheDocument();
    });

    test('should apply data-variant="secondary" by default when variant is omitted', () => {
      render(<NoDataAvailable actions={actions} />);

      const button = screen.getByRole('button', { name: 'Reset Filters' });

      expect(button).toHaveAttribute('data-variant', 'secondary');
    });

    test('should apply data-variant="primary" when variant is set to primary', () => {
      const primaryActions = [
        {
          id: 'refresh-page',
          label: 'Refresh Page',
          onClick: jest.fn(),
          variant: 'primary' as const,
        },
      ];

      render(<NoDataAvailable actions={primaryActions} />);

      const button = screen.getByRole('button', { name: 'Refresh Page' });

      expect(button).toHaveAttribute('data-variant', 'primary');
    });

    test('should apply correct variants when mixing primary and secondary actions', () => {
      const mixedActions = [
        { id: 'return-to-home', label: 'Return to Home', onClick: jest.fn() },
        {
          id: 'refresh-page',
          label: 'Refresh Page',
          onClick: jest.fn(),
          variant: 'primary' as const,
        },
      ];

      render(<NoDataAvailable actions={mixedActions} />);

      expect(
        screen.getByRole('button', { name: 'Return to Home' }),
      ).toHaveAttribute('data-variant', 'secondary');
      expect(
        screen.getByRole('button', { name: 'Refresh Page' }),
      ).toHaveAttribute('data-variant', 'primary');
    });
  });

  describe('Full composition', () => {
    test('should render all elements when all props are provided', () => {
      const actions = [
        { id: 'reset-filters', label: 'Reset Filters', onClick: jest.fn() },
      ];

      render(
        <NoDataAvailable
          dataTestId="empty-state-audience"
          icon={<img src="search.svg" alt="no data icon" />}
          title="No Audience Data Available for This Country"
          description="Consumer data for Brazil is not available."
          actions={actions}
        />,
      );

      expect(screen.getByTestId('empty-state-audience')).toBeInTheDocument();
      expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('no-data-title')).toHaveTextContent(
        'No Audience Data Available for This Country',
      );
      expect(screen.getByTestId('no-data-description')).toHaveTextContent(
        'Consumer data for Brazil is not available.',
      );
      expect(
        screen.getByRole('button', { name: 'Reset Filters' }),
      ).toBeInTheDocument();
    });
  });
});

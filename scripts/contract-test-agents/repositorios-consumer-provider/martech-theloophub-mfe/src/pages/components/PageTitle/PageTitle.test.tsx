import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PageTitle } from './PageTitle';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: jest.fn(({ id }: { id: string }) => id),
    formatNumber: jest.fn((n: number) => String(n)),
    formatDate: jest.fn((d: Date) => String(d)),
  }),
}));

const mockTrackGA = jest.fn();
jest.mock('hooks', () => ({
  ...jest.requireActual('hooks'),
  useGoogleAnalytics: () => mockTrackGA,
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({
    icon,
    ...props
  }: { icon: { displayName?: string } } & Record<string, unknown>) => (
    <span
      data-testid={props['data-testid'] as string | undefined}
      data-icon-name={icon?.displayName || 'Icon'}
    />
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: { displayName: 'Info' },
}));

jest.mock('@radix-ui/react-tooltip', () => {
  const React = jest.requireActual('react') as typeof import('react');
  const OpenContext = React.createContext<{
    open: boolean;
    setOpen: (next: boolean) => void;
  }>({ open: false, setOpen: () => undefined });

  return {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Root: ({
      children,
      onOpenChange,
    }: {
      children: React.ReactNode;
      onOpenChange?: (open: boolean) => void;
    }) => {
      const [open, setOpenState] = React.useState(false);
      const setOpen = (next: boolean) => {
        setOpenState(next);
        onOpenChange?.(next);
      };
      return (
        <OpenContext.Provider value={{ open, setOpen }}>
          {children}
        </OpenContext.Provider>
      );
    },
    Trigger: ({
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      asChild: _asChild,
      ...props
    }: {
      children: React.ReactNode;
      asChild?: boolean;
    } & Record<string, unknown>) => {
      const { setOpen } = React.useContext(OpenContext);
      return (
        <div
          {...props}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          {children}
        </div>
      );
    },
    Portal: ({ children }: { children: React.ReactNode }) => {
      const { open } = React.useContext(OpenContext);
      return open ? <>{children}</> : null;
    },
    Content: ({
      children,
      'data-testid': dataTestId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => (
      <div role="tooltip" data-testid={dataTestId}>
        {children}
      </div>
    ),
  };
});

describe('PageTitle', () => {
  beforeEach(() => {
    mockTrackGA.mockClear();
  });

  describe('rendering', () => {
    it('renders the title text inside a heading', () => {
      render(<PageTitle title="My Page Title" />);

      expect(
        screen.getByRole('heading', { name: 'My Page Title' }),
      ).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
      render(<PageTitle title="Title" description="Some description" />);

      expect(screen.getByText('Some description')).toBeInTheDocument();
    });

    it('does not render any description when omitted', () => {
      render(<PageTitle title="Title" dataTestId="test" />);

      expect(
        screen.queryByTestId('page-title-description-test'),
      ).not.toBeInTheDocument();
    });

    it('renders the right content slot when provided', () => {
      render(
        <PageTitle
          title="Title"
          rightContent={
            <button type="button" data-testid="right-content-child">
              Right Action
            </button>
          }
        />,
      );

      expect(
        screen.getByRole('button', { name: 'Right Action' }),
      ).toBeInTheDocument();
    });

    it('does not render the right content slot when omitted', () => {
      render(<PageTitle title="Title" />);

      expect(
        screen.queryByTestId('right-content-child'),
      ).not.toBeInTheDocument();
    });
  });

  describe('tooltip behavior', () => {
    it('renders the tooltip icon when tooltip prop is provided', () => {
      render(
        <PageTitle
          title="Title"
          tooltip={<span>Tooltip body</span>}
          dataTestId="test"
        />,
      );

      const icon = screen.getByTestId('page-title-tooltip-icon-test');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-icon-name', 'Info');
    });

    it('does not render the tooltip icon when tooltip prop is omitted', () => {
      render(<PageTitle title="Title" dataTestId="test" />);

      expect(
        screen.queryByTestId('page-title-tooltip-icon-test'),
      ).not.toBeInTheDocument();
    });

    it('reveals the tooltip content when the user hovers the icon', async () => {
      const user = userEvent.setup();
      render(
        <PageTitle
          title="Title"
          tooltip={<span>Hover body text</span>}
          dataTestId="test"
        />,
      );

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      await user.hover(screen.getByTestId('page-title-tooltip-test'));

      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toHaveTextContent('Hover body text');
    });

    it('tracks a GA event when the tooltip opens', async () => {
      const user = userEvent.setup();
      render(
        <PageTitle
          title="My Title"
          tooltip={<span>Tooltip body</span>}
          dataTestId="test"
        />,
      );

      await user.hover(screen.getByTestId('page-title-tooltip-test'));

      await waitFor(() => {
        expect(mockTrackGA).toHaveBeenCalledWith({
          event_category: 'Tooltip',
          event_action: 'Opened',
          event_label: 'My Title',
        });
      });
    });

    it('does not track a GA event when the tooltip never opens', () => {
      render(
        <PageTitle
          title="My Title"
          tooltip={<span>Tooltip body</span>}
          dataTestId="test"
        />,
      );

      expect(mockTrackGA).not.toHaveBeenCalled();
    });

    it('renders the tooltip icon for any supported size', () => {
      const sizes = ['large', 'medium', 'small'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(
          <PageTitle
            title="Title"
            tooltip={<span>Tooltip</span>}
            tooltipIconSize={size}
            dataTestId={`size-${size}`}
          />,
        );

        expect(
          screen.getByTestId(`page-title-tooltip-icon-size-${size}`),
        ).toBeInTheDocument();

        unmount();
      });
    });
  });

  describe('data-testid propagation', () => {
    it('exposes the container, title, description, tooltip and icon with the expected ids', () => {
      render(
        <PageTitle
          title="Title"
          description="Description"
          tooltip={<span>Tooltip</span>}
          dataTestId="test"
        />,
      );

      expect(screen.getByTestId('test')).toBeInTheDocument();
      expect(screen.getByTestId('page-title-test')).toHaveTextContent('Title');
      expect(
        screen.getByTestId('page-title-description-test'),
      ).toHaveTextContent('Description');
      expect(screen.getByTestId('page-title-tooltip-test')).toBeInTheDocument();
      expect(
        screen.getByTestId('page-title-tooltip-icon-test'),
      ).toBeInTheDocument();
    });

    it('omits prefixed data-testid attributes on every child when dataTestId is not provided', () => {
      render(
        <PageTitle
          title="Title"
          description="Description"
          tooltip={<span>Tooltip</span>}
        />,
      );

      expect(screen.queryByTestId(/^page-title-/)).not.toBeInTheDocument();
    });
  });
});

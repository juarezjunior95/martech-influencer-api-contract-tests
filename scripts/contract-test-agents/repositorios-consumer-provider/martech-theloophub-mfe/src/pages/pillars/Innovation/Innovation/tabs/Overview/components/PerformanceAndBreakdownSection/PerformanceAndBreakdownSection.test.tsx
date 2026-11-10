import React from 'react';

import { render, screen } from '@testing-library/react';

import { PerformanceAndBreakdownSection } from './PerformanceAndBreakdownSection';

const mockBasicContainer = jest.fn(
  ({
    children,
    dataTestId,
    header,
  }: {
    children?: React.ReactNode;
    dataTestId?: string;
    header?: {
      bottomTag?: React.ReactNode;
      tooltip?: React.ReactNode;
    };
  }) => (
    <div data-testid={dataTestId}>
      {header?.bottomTag}
      {header?.tooltip}
      {children}
    </div>
  ),
);

const mockTag = jest.fn(({ text }: { text: string }) => (
  <div data-testid="tag">{text}</div>
));

jest.mock('components', () => ({
  BasicContainer: (props: Record<string, unknown>) => mockBasicContainer(props),
  Tag: (props: Record<string, unknown>) => mockTag(props as { text: string }),
}));

const mockUseLastDataRefresh = jest.fn(() => ({
  lastDataRefreshKpisFormated: { innovation: '2024-01-01' } as Record<
    string,
    string | undefined
  >,
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('PerformanceAndBreakdownSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisFormated: { innovation: '2024-01-01' },
    });
  });

  it('passes title, layout, dataTestId and tooltip flags to BasicContainer', () => {
    render(<PerformanceAndBreakdownSection dataTestId="test-section" />);

    expect(mockBasicContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        dataTestId: 'test-section',
        header: expect.objectContaining({
          title: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.title',
          titleSize: 'H2',
          tooltipBackgroundTransparent: true,
        }),
        layout: {
          border: 'small',
          shadow: 'small',
          headerPadding: 'small',
          bodyPadding: true,
        },
      }),
    );
  });

  it.each(['test-section', 'test-section-123_special'])(
    'exposes dataTestId on the root container (%s)',
    (dataTestId) => {
      render(<PerformanceAndBreakdownSection dataTestId={dataTestId} />);

      expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
    },
  );

  it('does not set data-testid on the root when dataTestId is omitted', () => {
    const { container } = render(<PerformanceAndBreakdownSection />);

    expect(container.firstElementChild).not.toHaveAttribute('data-testid');
    expect(mockBasicContainer).toHaveBeenCalledWith(
      expect.objectContaining({ dataTestId: undefined }),
    );
  });

  it('renders tooltip copy and stable tooltip data-testids when dataTestId is set', () => {
    const { container } = render(
      <PerformanceAndBreakdownSection dataTestId="test-section" />,
    );

    expect(
      container.querySelector('[data-testid="test-section-tooltip-wrapper"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-testid="test-section-tooltip-container"]'),
    ).toHaveTextContent(
      'Innovation.Innovation.Overview.PerformanceAndBreakdown.tooltip',
    );
  });

  it('renders bottom tag with formatted innovation refresh when a date exists', () => {
    render(<PerformanceAndBreakdownSection dataTestId="test-section" />);

    expect(mockTag).toHaveBeenCalled();
    expect(screen.getByTestId('tag')).toHaveTextContent(': 2024-01-01');
  });

  it.each([
    {
      label: 'missing innovation key',
      value: {} as Record<string, string | undefined>,
    },
    {
      label: 'undefined innovation',
      value: { innovation: undefined },
    },
    {
      label: 'empty innovation string',
      value: { innovation: '' },
    },
    {
      label: 'undefined lastDataRefreshKpisFormated',
      value: undefined as unknown as Record<string, string | undefined>,
    },
  ])('does not render bottom tag when $label', ({ value }) => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisFormated: value,
    });

    render(<PerformanceAndBreakdownSection dataTestId="test-section" />);

    expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
    expect(mockTag).not.toHaveBeenCalled();
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';

import { StrategicInnovationData } from '../../types';
import { PORTFOLIO_HEALTH_HEADER_COLOR } from '../PortfolioHealthBigNumbers';
import { StrategicInnovation } from './StrategicInnovation';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);

const mockItemContent = jest.fn(
  ({
    item,
    dataTestId,
  }: {
    item: StrategicInnovationData;
    dataTestId?: string;
  }) => <div data-testid={dataTestId} data-item-id={item.id} />,
);

const mockSkeleton = jest.fn(
  ({
    height,
    width,
    length,
    dataTestId,
  }: {
    height: string;
    width: string;
    length: number;
    dataTestId?: string;
    gap?: string;
    borderRadius?: string;
  }) => (
    <div
      data-testid={dataTestId}
      data-height={height}
      data-width={width}
      data-length={length}
    />
  ),
);

jest.mock('components', () => ({
  Skeleton: (props: Record<string, unknown>) => mockSkeleton(props as never),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('./StrategicInnovation.styles', () => {
  const actual = jest.requireActual<
    typeof import('./StrategicInnovation.styles')
  >('./StrategicInnovation.styles');

  return {
    ...actual,
    StyledHeaderContainer: ({
      children,
      css,
    }: {
      children?: React.ReactNode;
      css?: { backgroundColor?: string };
    }) => (
      <div
        data-mock-header-bg={css?.backgroundColor ?? ''}
        style={css as React.CSSProperties}
      >
        {children}
      </div>
    ),
  };
});

jest.mock(
  '../StrategicInnovationItemContent/StrategicInnovationItemContent',
  () => ({
    StrategicInnovationItemContent: (props: Record<string, unknown>) =>
      mockItemContent(props as never),
  }),
);

const mockData: StrategicInnovationData[] = [
  {
    id: 'portfolio',
    headerColor: '#F1F1F1',
    chartSection: {},
    health: {
      id: 'health',
      period: '2024',
    },
  },
  {
    id: 'renovation',
    headerColor: '#E1E1E1',
    chartSection: {},
  },
];

const renderComponent = (
  data: StrategicInnovationData[] = mockData,
  loading = false,
  dataTestId?: string,
) =>
  render(
    <StrategicInnovation
      data={data}
      loading={loading}
      dataTestId={dataTestId}
    />,
  );

describe('StrategicInnovation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the pillars title and one item content mount per data row', () => {
    renderComponent();

    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.title',
    });

    expect(mockItemContent).toHaveBeenCalledTimes(mockData.length);

    mockData.forEach((item) => {
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: `Innovation.Innovation.Overview.StrategicInnovationPillars.${item.id}.title`,
      });

      expect(
        mockItemContent.mock.calls.some(([props]) => props.item === item),
      ).toBe(true);
    });
  });

  it('uses portfolio health palette for portfolio and item headerColor for other pillars', () => {
    renderComponent(mockData, false, 'si');

    const portfolioHeader = screen.getByTestId('si-header-portfolio');
    const renovationHeader = screen.getByTestId('si-header-renovation');

    expect(portfolioHeader.parentElement).toHaveAttribute(
      'data-mock-header-bg',
      PORTFOLIO_HEALTH_HEADER_COLOR,
    );
    expect(renovationHeader.parentElement).toHaveAttribute(
      'data-mock-header-bg',
      '#E1E1E1',
    );
  });

  it('renders no item content when data is empty', () => {
    renderComponent([]);

    expect(mockItemContent).not.toHaveBeenCalled();
  });

  it('renders loading skeletons with layout props and hides item content', () => {
    renderComponent(mockData, true, 'si');

    expect(mockSkeleton).toHaveBeenCalledWith(
      expect.objectContaining({
        height: '489px',
        width: '480px',
        length: 1,
        gap: 'medium',
        borderRadius: 'medium',
        dataTestId: 'skeleton-si-large',
      }),
    );

    expect(mockSkeleton).toHaveBeenCalledWith(
      expect.objectContaining({
        height: '489px',
        width: '248px',
        length: 3,
        gap: 'small',
        borderRadius: 'medium',
        dataTestId: 'skeleton-si-small',
      }),
    );

    expect(mockItemContent).not.toHaveBeenCalled();
    expect(screen.getByTestId('skeleton-si-large')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-si-small')).toBeInTheDocument();
    expect(screen.queryByTestId('si-container')).not.toBeInTheDocument();
  });

  it('does not mount skeletons when loading is false', () => {
    renderComponent(mockData, false);

    expect(mockSkeleton).not.toHaveBeenCalled();
  });

  it('replaces skeletons with content when loading flips to false', () => {
    const { rerender } = render(
      <StrategicInnovation data={mockData} loading dataTestId="si" />,
    );

    expect(screen.getByTestId('skeleton-si-large')).toBeInTheDocument();

    rerender(
      <StrategicInnovation data={mockData} loading={false} dataTestId="si" />,
    );

    expect(screen.queryByTestId('skeleton-si-large')).not.toBeInTheDocument();
    expect(screen.getByTestId('si-container')).toBeInTheDocument();
    expect(mockItemContent).toHaveBeenCalledTimes(mockData.length);
  });

  describe('dataTestId', () => {
    it.each([
      ['test-strategic-innovation'],
      ['test-strategic-innovation-123_special'],
    ])(
      'prefixes heading, container, items, headers, and item content (%s)',
      (prefix) => {
        renderComponent(mockData, false, prefix);

        expect(screen.getByTestId(`${prefix}-heading`)).toHaveTextContent(
          'Innovation.Innovation.Overview.StrategicInnovationPillars.title',
        );
        expect(screen.getByTestId(`${prefix}-container`)).toBeInTheDocument();
        expect(
          screen.getByTestId(`${prefix}-item-portfolio`),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`${prefix}-item-renovation`),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`${prefix}-header-portfolio`),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId(`${prefix}-header-renovation`),
        ).toBeInTheDocument();

        mockData.forEach((item) => {
          expect(mockItemContent).toHaveBeenCalledWith(
            expect.objectContaining({
              dataTestId: `${prefix}-item-content-${item.id}`,
            }),
          );
        });

        expect(screen.getByTestId(`${prefix}-container`)).toContainElement(
          screen.getByTestId(`${prefix}-item-portfolio`),
        );
      },
    );

    it('does not set data-testid on heading or container when dataTestId is omitted', () => {
      const { container } = renderComponent(mockData, false);

      expect(
        Array.from(container.querySelectorAll('[data-testid]')).some((el) =>
          (el as HTMLElement).dataset.testid?.endsWith('-heading'),
        ),
      ).toBe(false);
      expect(
        Array.from(container.querySelectorAll('[data-testid]')).some((el) =>
          (el as HTMLElement).dataset.testid?.endsWith('-container'),
        ),
      ).toBe(false);
    });

    it('does not pass dataTestId to StrategicInnovationItemContent when omitted', () => {
      renderComponent(mockData, false);

      expect(mockItemContent).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });

    it('supports a third pillar id in data-testid suffixes', () => {
      const extendedData = [
        ...mockData,
        {
          id: 'new-segment',
          headerColor: '#D1D1D1',
          chartSection: {},
        },
      ];

      renderComponent(extendedData, false, 'si');

      expect(screen.getByTestId('si-item-new-segment')).toBeInTheDocument();
      expect(screen.getByTestId('si-header-new-segment')).toBeInTheDocument();
    });
  });
});

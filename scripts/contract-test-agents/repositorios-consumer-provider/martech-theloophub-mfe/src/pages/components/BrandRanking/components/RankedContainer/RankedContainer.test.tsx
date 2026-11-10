import { render, screen } from '@testing-library/react';

import { RankedContainer } from './RankedContainer';

const mockData = {
  labels: [
    ['Brand A', 'Subtitle A'],
    ['Brand B', 'Subtitle B'],
  ] as [string, string][],
  datasets: [
    {
      data: [45, 30],
      source: ['abi', 'comp'],
      unitMeasure: ['%', '%'],
    },
  ],
  variation_caption: {
    title: 'Variation',
    subtitle: 'vs LY',
    variationsRows: {
      row1: {
        data: [
          {
            variationsGroup: [
              {
                variation: '5.2',
                unit_of_measure: 'pp',
                direction: 'up' as 'up' | 'down',
              },
            ],
          },
        ],
      },
    },
  },
};

jest.mock('../RankedVerticalBar', () => ({
  RankedVerticalBar: ({ data, dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `ranked-vertical-bar-${dataTestId}` : 'ranked-vertical-bar'
      }
      data-has-data={!!data}
      data-labels-length={data?.labels?.length}
    >
      RankedVerticalBar Component
    </div>
  ),
}));

jest.mock('components/VariationCaption', () => ({
  VariationCaption: ({
    variationCaptionData,
    gridColumnsCount,
    paddingLeft,
    paddingRight,
    headerMarginLeft,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'variation-caption'}
      data-grid-columns={gridColumnsCount}
      data-padding-left={paddingLeft}
      data-padding-right={paddingRight}
      data-header-margin-left={headerMarginLeft}
      data-has-data={!!variationCaptionData}
    >
      VariationCaption Component
    </div>
  ),
}));

jest.mock('./RankedContainer.styles', () => ({
  StyledContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'styled-container'}>{children}</div>,
  StyledChartWrapper: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-chart-wrapper'}>{children}</div>
  ),
}));

jest.mock('utils/getColor', () => ({
  getVariationColor: jest.fn((direction: string) => {
    if (direction === 'up') return '#00FF00';
    if (direction === 'down') return '#FF0000';
    return '#CCCCCC';
  }),
}));

describe('RankedContainer', () => {
  const defaultProps = {
    title: 'Test Title',
    measure: 'Market Share',
    onViewChange: jest.fn(),
    data: mockData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Structure', () => {
    it('renders StyledContainer', () => {
      render(<RankedContainer {...defaultProps} />);

      expect(screen.getByTestId('styled-container')).toBeInTheDocument();
    });

    it('renders StyledChartWrapper', () => {
      render(<RankedContainer {...defaultProps} />);

      expect(screen.getByTestId('styled-chart-wrapper')).toBeInTheDocument();
    });

    it('renders RankedVerticalBar', () => {
      render(<RankedContainer {...defaultProps} />);

      expect(screen.getByTestId('ranked-vertical-bar')).toBeInTheDocument();
    });

    it('renders VariationCaption when variation_caption is present', () => {
      render(<RankedContainer {...defaultProps} />);

      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();
    });

    it('does not render VariationCaption when variation_caption is undefined', () => {
      const dataWithoutVariation = {
        ...mockData,
        variation_caption: undefined,
      };
      render(<RankedContainer {...defaultProps} data={dataWithoutVariation} />);

      expect(screen.queryByTestId('variation-caption')).not.toBeInTheDocument();
    });
  });

  describe('RankedVerticalBar Props', () => {
    it('passes data to RankedVerticalBar', () => {
      render(<RankedContainer {...defaultProps} />);

      const rankedBar = screen.getByTestId('ranked-vertical-bar');
      expect(rankedBar).toHaveAttribute('data-has-data', 'true');
      expect(rankedBar).toHaveAttribute('data-labels-length', '2');
    });
  });

  describe('VariationCaption Props', () => {
    it('passes correct props to VariationCaption', () => {
      render(<RankedContainer {...defaultProps} />);

      const variationCaption = screen.getByTestId('variation-caption');
      expect(variationCaption).toHaveAttribute('data-grid-columns', '2');
      expect(variationCaption).toHaveAttribute('data-padding-left', '6');
      expect(variationCaption).toHaveAttribute('data-padding-right', '0');
      expect(variationCaption).toHaveAttribute('data-header-margin-left', '5');
      expect(variationCaption).toHaveAttribute('data-has-data', 'true');
    });

    it('uses labels length for gridColumnsCount', () => {
      const dataWithMoreLabels = {
        ...mockData,
        labels: [
          ['Brand A', 'Subtitle A'],
          ['Brand B', 'Subtitle B'],
          ['Brand C', 'Subtitle C'],
        ] as [string, string][],
      };

      render(<RankedContainer {...defaultProps} data={dataWithMoreLabels} />);

      const variationCaption = screen.getByTestId('variation-caption');
      expect(variationCaption).toHaveAttribute('data-grid-columns', '3');
    });

    it('variation caption wrapper has correct style', () => {
      const { container } = render(<RankedContainer {...defaultProps} />);

      const wrapper = container.querySelector('div[style*="margin-left"]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle({ marginLeft: -10 });
    });
  });

  describe('Component Hierarchy', () => {
    it('StyledChartWrapper is inside StyledContainer', () => {
      render(<RankedContainer {...defaultProps} />);

      const container = screen.getByTestId('styled-container');
      const chartWrapper = screen.getByTestId('styled-chart-wrapper');

      expect(container).toContainElement(chartWrapper);
    });

    it('RankedVerticalBar is inside StyledChartWrapper', () => {
      render(<RankedContainer {...defaultProps} />);

      const chartWrapper = screen.getByTestId('styled-chart-wrapper');
      const rankedBar = screen.getByTestId('ranked-vertical-bar');

      expect(chartWrapper).toContainElement(rankedBar);
    });

    it('VariationCaption is inside StyledContainer when present', () => {
      render(<RankedContainer {...defaultProps} />);

      const container = screen.getByTestId('styled-container');
      const variationCaption = screen.getByTestId('variation-caption');

      expect(container).toContainElement(variationCaption);
    });
  });

  describe('Component Stability', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<RankedContainer {...defaultProps} />);

      expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      expect(screen.getByTestId('ranked-vertical-bar')).toBeInTheDocument();

      rerender(<RankedContainer {...defaultProps} />);

      expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      expect(screen.getByTestId('ranked-vertical-bar')).toBeInTheDocument();
    });

    it('switches between with and without variation_caption correctly', () => {
      const { rerender } = render(<RankedContainer {...defaultProps} />);

      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();

      const dataWithoutVariation = {
        ...mockData,
        variation_caption: undefined,
      };
      rerender(
        <RankedContainer {...defaultProps} data={dataWithoutVariation} />,
      );

      expect(screen.queryByTestId('variation-caption')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles data without labels', () => {
      const dataWithoutLabels = {
        ...mockData,
        labels: [] as [string, string][],
      };
      render(<RankedContainer {...defaultProps} data={dataWithoutLabels} />);

      expect(screen.getByTestId('ranked-vertical-bar')).toBeInTheDocument();
      const variationCaption = screen.getByTestId('variation-caption');
      expect(variationCaption).toHaveAttribute('data-grid-columns', '0');
    });

    it('handles null variation_caption', () => {
      const dataWithNullVariation = {
        ...mockData,
        variation_caption: null as any,
      };
      render(
        <RankedContainer {...defaultProps} data={dataWithNullVariation} />,
      );

      expect(screen.queryByTestId('variation-caption')).not.toBeInTheDocument();
    });

    it('handles empty variationsRows', () => {
      const dataWithEmptyVariations = {
        ...mockData,
        variation_caption: {
          title: 'Variation',
          subtitle: 'vs LY',
          variationsRows: {},
        },
      };

      render(
        <RankedContainer {...defaultProps} data={dataWithEmptyVariations} />,
      );

      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();
    });

    it('handles undefined variationsRows', () => {
      const dataWithUndefinedVariations = {
        ...mockData,
        variation_caption: {
          title: 'Variation',
          subtitle: 'vs LY',
          variationsRows: undefined as any,
        },
      };

      render(
        <RankedContainer
          {...defaultProps}
          data={dataWithUndefinedVariations}
        />,
      );

      expect(screen.getByTestId('variation-caption')).toBeInTheDocument();
    });
  });

  describe('data-testid Implementation', () => {
    describe('dataTestId prop', () => {
      it('accepts dataTestId as optional prop', () => {
        render(
          <RankedContainer {...defaultProps} dataTestId="container-test" />,
        );

        expect(
          screen.getByTestId('ranked-container-container-test'),
        ).toBeInTheDocument();
      });

      it('renders without dataTestId prop', () => {
        render(<RankedContainer {...defaultProps} />);

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-container-'),
        ).not.toBeInTheDocument();
      });

      it('does not render data-testid when dataTestId is undefined', () => {
        render(<RankedContainer {...defaultProps} dataTestId={undefined} />);

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-container-'),
        ).not.toBeInTheDocument();
      });

      it('does not render data-testid when dataTestId is empty string', () => {
        render(<RankedContainer {...defaultProps} dataTestId="" />);

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
        expect(
          screen.queryByTestId('ranked-container-'),
        ).not.toBeInTheDocument();
      });
    });

    describe('StyledContainer data-testid', () => {
      it('applies correct data-testid to StyledContainer', () => {
        render(
          <RankedContainer {...defaultProps} dataTestId="test-container" />,
        );

        expect(
          screen.getByTestId('ranked-container-test-container'),
        ).toBeInTheDocument();
      });

      it('uses ranked-container- prefix', () => {
        render(<RankedContainer {...defaultProps} dataTestId="my-container" />);

        const container = screen.getByTestId('ranked-container-my-container');
        expect(container).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<RankedContainer {...defaultProps} />);

        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      });
    });

    describe('StyledChartWrapper data-testid', () => {
      it('applies correct data-testid to StyledChartWrapper', () => {
        render(<RankedContainer {...defaultProps} dataTestId="test-chart" />);

        expect(
          screen.getByTestId('ranked-chart-wrapper-test-chart'),
        ).toBeInTheDocument();
      });

      it('uses ranked-chart-wrapper- prefix', () => {
        render(<RankedContainer {...defaultProps} dataTestId="my-chart" />);

        const chartWrapper = screen.getByTestId(
          'ranked-chart-wrapper-my-chart',
        );
        expect(chartWrapper).toBeInTheDocument();
      });

      it('does not apply data-testid when dataTestId is not provided', () => {
        render(<RankedContainer {...defaultProps} />);

        expect(screen.getByTestId('styled-chart-wrapper')).toBeInTheDocument();
      });
    });

    describe('RankedVerticalBar data-testid propagation', () => {
      it('propagates dataTestId directly to RankedVerticalBar', () => {
        render(
          <RankedContainer {...defaultProps} dataTestId="vertical-bar-test" />,
        );

        expect(
          screen.getByTestId('ranked-vertical-bar-vertical-bar-test'),
        ).toBeInTheDocument();
      });

      it('renders RankedVerticalBar with default data-testid when dataTestId not provided', () => {
        render(<RankedContainer {...defaultProps} />);

        expect(screen.getByTestId('ranked-vertical-bar')).toBeInTheDocument();
      });
    });

    describe('Variation caption wrapper data-testid', () => {
      it('propagates dataTestId to VariationCaption component', () => {
        render(<RankedContainer {...defaultProps} dataTestId="caption-test" />);

        expect(
          screen.getByTestId('variation-caption-caption-test'),
        ).toBeInTheDocument();
      });

      it('uses variation-caption- prefix', () => {
        render(<RankedContainer {...defaultProps} dataTestId="my-caption" />);

        const caption = screen.getByTestId('variation-caption-my-caption');
        expect(caption).toBeInTheDocument();
      });

      it('does not render VariationCaption when variation_caption is undefined', () => {
        const dataWithoutVariation = {
          ...mockData,
          variation_caption: undefined,
        };
        render(
          <RankedContainer
            {...defaultProps}
            data={dataWithoutVariation}
            dataTestId="no-caption"
          />,
        );

        expect(
          screen.queryByTestId('variation-caption-no-caption'),
        ).not.toBeInTheDocument();
      });
    });

    describe('dataTestId hierarchy validation', () => {
      it('renders all data-testids in correct hierarchy', () => {
        render(
          <RankedContainer {...defaultProps} dataTestId="hierarchy-test" />,
        );

        const container = screen.getByTestId('ranked-container-hierarchy-test');
        const chartWrapper = screen.getByTestId(
          'ranked-chart-wrapper-hierarchy-test',
        );
        const verticalBar = screen.getByTestId(
          'ranked-vertical-bar-hierarchy-test',
        );
        const caption = screen.getByTestId('variation-caption-hierarchy-test');

        expect(container).toContainElement(chartWrapper);
        expect(chartWrapper).toContainElement(verticalBar);
        expect(container).toContainElement(caption);
      });

      it('maintains hierarchy without variation caption', () => {
        const dataWithoutVariation = {
          ...mockData,
          variation_caption: undefined,
        };
        render(
          <RankedContainer
            {...defaultProps}
            data={dataWithoutVariation}
            dataTestId="no-caption-hierarchy"
          />,
        );

        const container = screen.getByTestId(
          'ranked-container-no-caption-hierarchy',
        );
        const chartWrapper = screen.getByTestId(
          'ranked-chart-wrapper-no-caption-hierarchy',
        );
        const verticalBar = screen.getByTestId(
          'ranked-vertical-bar-no-caption-hierarchy',
        );

        expect(container).toContainElement(chartWrapper);
        expect(chartWrapper).toContainElement(verticalBar);
      });
    });

    describe('dataTestId with special characters', () => {
      it('handles dataTestId with hyphens', () => {
        render(
          <RankedContainer
            {...defaultProps}
            dataTestId="ranked-container-test"
          />,
        );

        expect(
          screen.getByTestId('ranked-container-ranked-container-test'),
        ).toBeInTheDocument();
      });

      it('handles dataTestId with numbers', () => {
        render(<RankedContainer {...defaultProps} dataTestId="container123" />);

        expect(
          screen.getByTestId('ranked-container-container123'),
        ).toBeInTheDocument();
      });

      it('handles dataTestId with underscores', () => {
        render(
          <RankedContainer {...defaultProps} dataTestId="container_test_id" />,
        );

        expect(
          screen.getByTestId('ranked-container-container_test_id'),
        ).toBeInTheDocument();
      });
    });

    describe('dataTestId persistence across renders', () => {
      it('maintains dataTestId after rerender', () => {
        const { rerender } = render(
          <RankedContainer {...defaultProps} dataTestId="persistent" />,
        );

        expect(
          screen.getByTestId('ranked-container-persistent'),
        ).toBeInTheDocument();

        rerender(<RankedContainer {...defaultProps} dataTestId="persistent" />);

        expect(
          screen.getByTestId('ranked-container-persistent'),
        ).toBeInTheDocument();
      });

      it('updates dataTestId when changed', () => {
        const { rerender } = render(
          <RankedContainer {...defaultProps} dataTestId="first" />,
        );

        expect(
          screen.getByTestId('ranked-container-first'),
        ).toBeInTheDocument();

        rerender(<RankedContainer {...defaultProps} dataTestId="second" />);

        expect(
          screen.queryByTestId('ranked-container-first'),
        ).not.toBeInTheDocument();
        expect(
          screen.getByTestId('ranked-container-second'),
        ).toBeInTheDocument();
      });

      it('removes dataTestId when changed to undefined', () => {
        const { rerender } = render(
          <RankedContainer {...defaultProps} dataTestId="removable" />,
        );

        expect(
          screen.getByTestId('ranked-container-removable'),
        ).toBeInTheDocument();

        rerender(<RankedContainer {...defaultProps} dataTestId={undefined} />);

        expect(
          screen.queryByTestId('ranked-container-removable'),
        ).not.toBeInTheDocument();
        expect(screen.getByTestId('styled-container')).toBeInTheDocument();
      });
    });

    describe('dataTestId with variation caption states', () => {
      it('maintains dataTestId when variation_caption is present', () => {
        render(<RankedContainer {...defaultProps} dataTestId="with-caption" />);

        expect(
          screen.getByTestId('ranked-container-with-caption'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('variation-caption-with-caption'),
        ).toBeInTheDocument();
      });

      it('maintains dataTestId when variation_caption is absent', () => {
        const dataWithoutVariation = {
          ...mockData,
          variation_caption: undefined,
        };
        render(
          <RankedContainer
            {...defaultProps}
            data={dataWithoutVariation}
            dataTestId="without-caption"
          />,
        );

        expect(
          screen.getByTestId('ranked-container-without-caption'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('variation-caption-without-caption'),
        ).not.toBeInTheDocument();
      });

      it('preserves dataTestId across variation caption changes', () => {
        const { rerender } = render(
          <RankedContainer {...defaultProps} dataTestId="caption-change" />,
        );

        expect(
          screen.getByTestId('variation-caption-caption-change'),
        ).toBeInTheDocument();

        const dataWithoutVariation = {
          ...mockData,
          variation_caption: undefined,
        };
        rerender(
          <RankedContainer
            {...defaultProps}
            data={dataWithoutVariation}
            dataTestId="caption-change"
          />,
        );

        expect(
          screen.getByTestId('ranked-container-caption-change'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('variation-caption-caption-change'),
        ).not.toBeInTheDocument();
      });
    });
  });
});

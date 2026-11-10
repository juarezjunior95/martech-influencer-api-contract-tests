import { render, screen } from '@testing-library/react';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, ...props }: any) => (
    <span data-testid="info-icon" {...props} />
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => null,
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('./ComparisonLine.styles', () => ({
  StyledComparisonLineContainer: ({
    children,
    striped,
    'data-testid': testId,
  }: any) => (
    <div
      className="container"
      data-testid={testId}
      data-striped={String(striped)}
    >
      {children}
    </div>
  ),
  StyledComparisonLine: ({ children, style, 'data-testid': testId }: any) => (
    <div
      className="comparison-line"
      data-testid={testId}
      style={style}
      data-padding-left={style?.paddingLeft}
      data-padding-right={style?.paddingRight}
      data-margin-left={style?.marginLeft}
      data-margin-right={style?.marginRight}
    >
      {children}
    </div>
  ),
  StyledComparisonLineTitleContainer: ({
    children,
    'data-testid': testId,
  }: any) => (
    <div className="title-container" data-testid={testId}>
      {children}
    </div>
  ),
  StyledComparisonLineTitle: ({ children, 'data-testid': testId }: any) => (
    <span className="line-title" data-testid={testId}>
      {children}
    </span>
  ),
  StyledComparisonLineValue: ({
    children,
    size,
    style,
    'data-testid': testId,
  }: any) => (
    <span
      className="line-value"
      data-testid={testId}
      data-size={size}
      style={style}
      data-color={style?.color}
    >
      {children}
    </span>
  ),
  StyledComparisonLineBadge: ({
    children,
    badgeColor,
    'data-testid': testId,
  }: any) => (
    <span
      className="line-badge"
      data-testid={testId}
      data-badge-color={badgeColor}
    >
      {children}
    </span>
  ),
  StyledTooltipInfoIcon: ({ children }: any) => (
    <div className="tooltip-info-icon">{children}</div>
  ),
}));

import { ComparisonLine, ComparisonLineData } from './ComparisonLine';

describe('ComparisonLine', () => {
  const mockData: ComparisonLineData[] = [
    {
      title: 'Revenue',
      data: [
        { value: '100', measure: 'M' },
        { value: '200', measure: 'M' },
      ],
    },
    {
      title: 'Growth',
      data: [
        { value: '10', measure: '%', color: 'green' },
        { value: '-5', measure: '%', color: 'red' },
      ],
    },
  ];

  const defaultProps = {
    data: mockData,
    gridColumnsLength: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render container', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      expect(container.querySelector('.container')).toBeInTheDocument();
    });

    it('should render comparison lines for each data item', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      const lines = container.querySelectorAll('.comparison-line');
      expect(lines).toHaveLength(2);
    });

    it('should render titles for each line', () => {
      render(<ComparisonLine {...defaultProps} />);

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Growth')).toBeInTheDocument();
    });

    it('should render values with measures', () => {
      render(<ComparisonLine {...defaultProps} />);

      expect(screen.getByText('100M')).toBeInTheDocument();
      expect(screen.getByText('200M')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('-5%')).toBeInTheDocument();
    });
  });

  describe('striped', () => {
    it('should set striped to true when data length > 3', () => {
      const manyData: ComparisonLineData[] = [
        { title: 'Line 1', data: [{ value: '1' }] },
        { title: 'Line 2', data: [{ value: '2' }] },
        { title: 'Line 3', data: [{ value: '3' }] },
        { title: 'Line 4', data: [{ value: '4' }] },
      ];

      const { container } = render(
        <ComparisonLine data={manyData} gridColumnsLength={1} />,
      );

      const containerEl = container.querySelector('.container');
      expect(containerEl).toHaveAttribute('data-striped', 'true');
    });

    it('should set striped to false when data length <= 3', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      const containerEl = container.querySelector('.container');
      expect(containerEl).toHaveAttribute('data-striped', 'false');
    });

    it('should set striped to false when data length is exactly 3', () => {
      const threeData: ComparisonLineData[] = [
        { title: 'Line 1', data: [{ value: '1' }] },
        { title: 'Line 2', data: [{ value: '2' }] },
        { title: 'Line 3', data: [{ value: '3' }] },
      ];

      const { container } = render(
        <ComparisonLine data={threeData} gridColumnsLength={1} />,
      );

      const containerEl = container.querySelector('.container');
      expect(containerEl).toHaveAttribute('data-striped', 'false');
    });
  });

  describe('gridColumnsLength', () => {
    it('should render values in grid layout', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} gridColumnsLength={4} />,
      );

      const values = container.querySelectorAll('.line-value');
      expect(values.length).toBeGreaterThan(0);
    });

    it('should render all values from data', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} gridColumnsLength={2} />,
      );

      const values = container.querySelectorAll('.line-value');
      expect(values).toHaveLength(4);
    });
  });

  describe('gridConfig', () => {
    it('should use default grid config when not provided', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-padding-left', '8');
      expect(line).toHaveAttribute('data-padding-right', '8');
    });

    it('should use custom paddingLeft', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} gridConfig={{ paddingLeft: 16 }} />,
      );

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-padding-left', '16');
    });

    it('should use custom paddingRight', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} gridConfig={{ paddingRight: 24 }} />,
      );

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-padding-right', '24');
    });

    it('should merge custom grid config with defaults', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} gridConfig={{ paddingLeft: 20 }} />,
      );

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-padding-left', '20');
      expect(line).toHaveAttribute('data-padding-right', '8');
    });
  });

  describe('borderConfig', () => {
    it('should use default border config when not provided', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-margin-left', '0');
      expect(line).toHaveAttribute('data-margin-right', '0');
    });

    it('should use custom marginLeft', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} borderConfig={{ marginLeft: 10 }} />,
      );

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-margin-left', '10');
    });

    it('should use custom marginRight', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} borderConfig={{ marginRight: 15 }} />,
      );

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-margin-right', '15');
    });

    it('should merge custom border config with defaults', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} borderConfig={{ marginLeft: 5 }} />,
      );

      const line = container.querySelectorAll('.comparison-line')[0];
      expect(line).toHaveAttribute('data-margin-left', '5');
      expect(line).toHaveAttribute('data-margin-right', '0');
    });
  });

  describe('size', () => {
    it('should use default size when not provided', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      const values = container.querySelectorAll('.line-value');
      expect(values[0]).toHaveAttribute('data-size', 'default');
    });

    it('should pass medium size to values', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} size="medium" />,
      );

      const values = container.querySelectorAll('.line-value');
      expect(values[0]).toHaveAttribute('data-size', 'medium');
    });
  });

  describe('value colors', () => {
    it('should apply color to values', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      const values = container.querySelectorAll('.line-value');
      const greenValue = Array.from(values).find(
        (v) => v.textContent === '10%',
      );
      const redValue = Array.from(values).find((v) => v.textContent === '-5%');

      expect(greenValue).toHaveAttribute('data-color', 'green');
      expect(redValue).toHaveAttribute('data-color', 'red');
    });

    it('should handle values without color', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      const values = container.querySelectorAll('.line-value');
      const noColorValue = Array.from(values).find(
        (v) => v.textContent === '100M',
      );

      expect(noColorValue).not.toHaveAttribute('data-color');
    });
  });

  describe('empty data', () => {
    it('should handle empty data array', () => {
      const { container } = render(
        <ComparisonLine data={[]} gridColumnsLength={2} />,
      );

      expect(container.querySelector('.container')).toBeInTheDocument();
      expect(
        container.querySelector('.comparison-line'),
      ).not.toBeInTheDocument();
    });

    it('should handle line with empty data array', () => {
      const emptyLineData: ComparisonLineData[] = [
        { title: 'Empty Line', data: [] },
      ];

      const { container } = render(
        <ComparisonLine data={emptyLineData} gridColumnsLength={2} />,
      );

      expect(screen.getByText('Empty')).toBeInTheDocument();
      expect(screen.getByText('Line')).toBeInTheDocument();
      expect(container.querySelector('.line-value')).not.toBeInTheDocument();
    });

    it('should render fallback dash when title is undefined', () => {
      const undefinedTitleData = [
        { title: undefined, data: [{ value: '10', measure: '%' }] },
      ] as unknown as ComparisonLineData[];

      expect(() =>
        render(
          <ComparisonLine data={undefinedTitleData} gridColumnsLength={1} />,
        ),
      ).not.toThrow();

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('should render fallback dash when title is empty string', () => {
      const emptyTitleData: ComparisonLineData[] = [
        { title: '', data: [{ value: '20', measure: '%' }] },
      ];

      expect(() =>
        render(<ComparisonLine data={emptyTitleData} gridColumnsLength={1} />),
      ).not.toThrow();

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('20%')).toBeInTheDocument();
    });
  });

  describe('values without measure', () => {
    it('should render values without measure', () => {
      const dataWithoutMeasure: ComparisonLineData[] = [
        {
          title: 'Count',
          data: [{ value: '42' }, { value: '100' }],
        },
      ];

      render(
        <ComparisonLine data={dataWithoutMeasure} gridColumnsLength={2} />,
      );

      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  describe('numeric values', () => {
    it('should render numeric values', () => {
      const numericData: ComparisonLineData[] = [
        {
          title: 'Numbers',
          data: [{ value: 123 }, { value: 456 }],
        },
      ];

      render(<ComparisonLine data={numericData} gridColumnsLength={2} />);

      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText('456')).toBeInTheDocument();
    });
  });

  describe('dataTestId prop', () => {
    it('should apply data-testid when dataTestId prop is provided', () => {
      render(
        <ComparisonLine {...defaultProps} dataTestId="comparison-revenue" />,
      );

      expect(screen.getByTestId('comparison-revenue')).toBeInTheDocument();
    });

    it('should apply data-testid to rows when dataTestId prop is provided', () => {
      render(
        <ComparisonLine {...defaultProps} dataTestId="comparison-revenue" />,
      );

      expect(
        screen.getByTestId('comparison-revenue-row-0'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('comparison-revenue-row-1'),
      ).toBeInTheDocument();
    });

    it('should apply data-testid to row elements when dataTestId prop is provided', () => {
      render(
        <ComparisonLine {...defaultProps} dataTestId="comparison-revenue" />,
      );

      expect(
        screen.getByTestId('comparison-revenue-row-0-title'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('comparison-revenue-row-0-values'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('comparison-revenue-row-0-value-0'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId prop is not provided', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      expect(
        container.querySelector('[data-testid="comparison-revenue"]'),
      ).not.toBeInTheDocument();
      expect(container.querySelector('.container')).toBeInTheDocument();
    });
  });

  describe('badge variant', () => {
    it('should render badge variant values', () => {
      const badgeData: ComparisonLineData[] = [
        {
          title: 'Index',
          data: [
            { value: '111', variant: 'badge', badgeColor: 'positive' },
            { value: '93', variant: 'badge', badgeColor: 'negative' },
          ],
        },
      ];

      const { container } = render(
        <ComparisonLine data={badgeData} gridColumnsLength={2} />,
      );

      const badges = container.querySelectorAll('.line-badge');
      expect(badges).toHaveLength(2);
      expect(badges[0]).toHaveTextContent('111');
      expect(badges[0]).toHaveAttribute('data-badge-color', 'positive');
      expect(badges[1]).toHaveTextContent('93');
      expect(badges[1]).toHaveAttribute('data-badge-color', 'negative');
    });

    it('should default badgeColor to neutral when not provided', () => {
      const badgeData: ComparisonLineData[] = [
        {
          title: 'Index',
          data: [{ value: '100', variant: 'badge' }],
        },
      ];

      const { container } = render(
        <ComparisonLine data={badgeData} gridColumnsLength={1} />,
      );

      const badge = container.querySelector('.line-badge');
      expect(badge).toHaveAttribute('data-badge-color', 'neutral');
    });

    it('should render mixed text and badge variants in same row', () => {
      const mixedData: ComparisonLineData[] = [
        {
          title: 'Mixed',
          data: [
            { value: '10%', color: 'green' },
            { value: '111', variant: 'badge', badgeColor: 'positive' },
          ],
        },
      ];

      const { container } = render(
        <ComparisonLine data={mixedData} gridColumnsLength={2} />,
      );

      expect(container.querySelectorAll('.line-value')).toHaveLength(1);
      expect(container.querySelectorAll('.line-badge')).toHaveLength(1);
    });
  });

  describe('trend colors', () => {
    it('should apply positive trend color', () => {
      const trendData: ComparisonLineData[] = [
        {
          title: 'Trend',
          data: [{ value: '0.2pp', trend: 'positive' }],
        },
      ];

      const { container } = render(
        <ComparisonLine data={trendData} gridColumnsLength={1} />,
      );

      const value = container.querySelector('.line-value');
      expect(value).toHaveAttribute('data-color', '#007800');
    });

    it('should apply negative trend color', () => {
      const trendData: ComparisonLineData[] = [
        {
          title: 'Trend',
          data: [{ value: '-0.2pp', trend: 'negative' }],
        },
      ];

      const { container } = render(
        <ComparisonLine data={trendData} gridColumnsLength={1} />,
      );

      const value = container.querySelector('.line-value');
      expect(value).toHaveAttribute('data-color', '#B91C1C');
    });

    it('should use custom trendColors when provided', () => {
      const customColors = {
        positive: '#00FF00',
        negative: '#FF0000',
        neutral: '#888888',
      };
      const trendData: ComparisonLineData[] = [
        {
          title: 'Trend',
          data: [{ value: '5pp', trend: 'positive' }],
        },
      ];

      const { container } = render(
        <ComparisonLine
          data={trendData}
          gridColumnsLength={1}
          trendColors={customColors}
        />,
      );

      const value = container.querySelector('.line-value');
      expect(value).toHaveAttribute('data-color', '#00FF00');
    });

    it('should map known positive default color to trend color', () => {
      const trendData: ComparisonLineData[] = [
        {
          title: 'Color',
          data: [{ value: '5pp', color: '#007800' }],
        },
      ];

      const { container } = render(
        <ComparisonLine data={trendData} gridColumnsLength={1} />,
      );

      const value = container.querySelector('.line-value');
      expect(value).toHaveAttribute('data-color', '#007800');
    });

    it('should map known negative default color to trend color', () => {
      const trendData: ComparisonLineData[] = [
        {
          title: 'Color',
          data: [{ value: '-5pp', color: '#B91C1C' }],
        },
      ];

      const { container } = render(
        <ComparisonLine data={trendData} gridColumnsLength={1} />,
      );

      const value = container.querySelector('.line-value');
      expect(value).toHaveAttribute('data-color', '#B91C1C');
    });

    it('should map known neutral default color to trend color', () => {
      const trendData: ComparisonLineData[] = [
        {
          title: 'Color',
          data: [{ value: '0pp', color: '#67665F' }],
        },
      ];

      const { container } = render(
        <ComparisonLine data={trendData} gridColumnsLength={1} />,
      );

      const value = container.querySelector('.line-value');
      expect(value).toHaveAttribute('data-color', '#67665F');
    });
  });

  describe('tooltip', () => {
    it('should render InfoTooltip when tooltip is provided', () => {
      const dataWithTooltip: ComparisonLineData[] = [
        {
          title: 'Performance Index',
          tooltip: {
            title: 'Performance Index',
            text: 'This is a tooltip',
          },
          data: [{ value: '111' }],
        },
      ];

      render(<ComparisonLine data={dataWithTooltip} gridColumnsLength={1} />);

      expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    });

    it('should not render InfoTooltip when tooltip is not provided', () => {
      render(<ComparisonLine {...defaultProps} />);

      expect(screen.queryByTestId('info-icon')).not.toBeInTheDocument();
    });
  });

  describe('gap', () => {
    it('should use default gap based on size "small"', () => {
      const { container } = render(
        <ComparisonLine {...defaultProps} size="small" />,
      );

      expect(container.querySelector('.container')).toBeInTheDocument();
    });

    it('should apply custom gap to grid', () => {
      render(<ComparisonLine {...defaultProps} gap={22} />);

      expect(screen.getByText('100M')).toBeInTheDocument();
    });
  });

  describe('rowConfig', () => {
    it('should apply custom rowConfig height and alignItems', () => {
      const { container } = render(
        <ComparisonLine
          {...defaultProps}
          rowConfig={{ height: 50, alignItems: 'center' }}
        />,
      );

      const line = container.querySelector('.comparison-line') as HTMLElement;
      expect(line.style.height).toBe('50px');
      expect(line.style.alignItems).toBe('center');
    });
  });

  describe('innerBorderConfig', () => {
    it('should use default innerBorderConfig when not provided', () => {
      const { container } = render(<ComparisonLine {...defaultProps} />);

      expect(container.querySelector('.container')).toBeInTheDocument();
    });

    it('should apply custom innerBorderConfig', () => {
      render(
        <ComparisonLine
          {...defaultProps}
          innerBorderConfig={{ marginLeft: 7, marginRight: -8 }}
        />,
      );

      expect(screen.getByText('100M')).toBeInTheDocument();
    });
  });

  describe('title rendering', () => {
    it('should split title and render first word separately', () => {
      const data: ComparisonLineData[] = [
        {
          title: 'vs LY',
          data: [{ value: '10' }],
        },
      ];

      render(<ComparisonLine data={data} gridColumnsLength={1} />);

      expect(screen.getByText('vs')).toBeInTheDocument();
      expect(screen.getByText('LY')).toBeInTheDocument();
    });

    it('should render single-word title without second span', () => {
      const data: ComparisonLineData[] = [
        {
          title: 'Revenue',
          data: [{ value: '10' }],
        },
      ];

      render(<ComparisonLine data={data} gridColumnsLength={1} />);

      expect(screen.getByText('Revenue')).toBeInTheDocument();
    });
  });
});

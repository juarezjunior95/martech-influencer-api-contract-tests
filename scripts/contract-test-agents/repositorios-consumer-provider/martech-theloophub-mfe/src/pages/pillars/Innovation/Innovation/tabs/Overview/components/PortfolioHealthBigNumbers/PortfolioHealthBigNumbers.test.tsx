import React from 'react';

import { render, screen } from '@testing-library/react';

import { BigNumbersItem } from '../../types';
import { PortfolioHealthBigNumbers } from './PortfolioHealthBigNumbers';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => {
  const messages: Record<string, string> = {
    'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.innovationPhi.label':
      'Innovation PHI',
    'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.maturePhi.label':
      'Mature PHI',
  };
  return messages[id] ?? id;
});

const mockBigNumber = jest.fn((props: any) => (
  <div data-testid={props.dataTestId ?? props['data-testid']}>BigNumber</div>
));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('components', () => ({
  BigNumber: (props: Record<string, unknown>) => mockBigNumber(props),
}));

const defaultData: BigNumbersItem[] = [
  {
    data: [
      {
        bigNumber: { value: '1.985', color: '' },
        comparison: {
          label: 'vs',
          value: "Jul'25",
          number: { value: '1.1', measure: '%', trend: 'positive' },
        },
      },
    ],
  },
  {
    data: [
      {
        bigNumber: { value: '1.985', color: '' },
        comparison: {
          label: 'vs',
          value: "Jul'25",
          number: { value: '1.1', measure: '%', trend: 'positive' },
        },
      },
    ],
  },
];

const renderComponent = (
  data: BigNumbersItem[] = defaultData,
  dataTestId?: string,
) => render(<PortfolioHealthBigNumbers data={data} dataTestId={dataTestId} />);

const getBigNumberProps = (index: number) =>
  mockBigNumber.mock.calls[index]?.[0];

describe('PortfolioHealthBigNumbers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders one BigNumber per data item with portfolio border colors', () => {
    const { container } = renderComponent();

    expect(mockBigNumber).toHaveBeenCalledTimes(defaultData.length);

    const items = container.querySelectorAll('.big-number-item');
    expect(items[0]).toHaveStyle({ borderLeft: '6px solid #D3E3EE' });
    expect(items[1]).toHaveStyle({ borderLeft: '6px solid #EDDAB1' });
  });

  it('requests i18n labels for each portfolio health slot and forwards layout props to BigNumber', () => {
    renderComponent();

    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.innovationPhi.label',
    });
    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.maturePhi.label',
    });
    expect(mockFormatMessage).toHaveBeenCalledTimes(2);

    expect(getBigNumberProps(0)).toMatchObject({
      asCard: false,
      size: 'medium',
      alignment: 'left',
      orientation: 'center',
      fullWidth: true,
      preserveComparisonSpace: true,
    });

    expect(getBigNumberProps(0).data[0].secondaryInfo.label).toBe(
      'Innovation PHI',
    );
    expect(getBigNumberProps(1).data[0].secondaryInfo.label).toBe('Mature PHI');

    expect(getBigNumberProps(0).data[0].bigNumber.value).toBe('1.985');
    expect(getBigNumberProps(0).data[0].comparison.number.value).toBe('1.1');
    expect(getBigNumberProps(0).data[0].comparison.number.measure).toBe('%');
  });

  it('maps positive and negative trends to colors on bigNumber and comparison number', () => {
    const dataWithTrend: BigNumbersItem[] = [
      {
        data: [
          {
            bigNumber: { value: '1.985', measure: '%', trend: 'positive' },
            comparison: {
              label: 'vs',
              value: "Jul'25",
              number: { value: '1.1', measure: 'pp', trend: 'positive' },
            },
          },
        ],
      },
      {
        data: [
          {
            bigNumber: { value: '1.985', measure: '%', trend: 'negative' },
            comparison: {
              label: 'vs',
              value: "Jul'25",
              number: { value: '-0.5', measure: 'pp', trend: 'negative' },
            },
          },
        ],
      },
    ];

    renderComponent(dataWithTrend);

    expect(getBigNumberProps(0).data[0].bigNumber.color).toBe('#007800');
    expect(getBigNumberProps(0).data[0].comparison.number.color).toBe(
      '#007800',
    );

    expect(getBigNumberProps(1).data[0].bigNumber.color).toBe('#B91C1C');
    expect(getBigNumberProps(1).data[0].comparison.number.color).toBe(
      '#B91C1C',
    );
  });

  it('keeps explicit colors when trend is also present', () => {
    const dataWithBoth: BigNumbersItem[] = [
      {
        data: [
          {
            bigNumber: {
              value: '1.985',
              color: '#CUSTOM',
              trend: 'positive',
            },
            comparison: {
              label: 'vs',
              value: "Jul'25",
              number: {
                value: '1.1',
                measure: 'pp',
                color: '#CUSTOM2',
                trend: 'positive',
              },
            },
          },
        ],
      },
    ];

    renderComponent(dataWithBoth);

    expect(getBigNumberProps(0).data[0].bigNumber.color).toBe('#CUSTOM');
    expect(getBigNumberProps(0).data[0].comparison.number.color).toBe(
      '#CUSTOM2',
    );
  });

  it('leaves colors unset when no trend and no color is provided', () => {
    const dataWithoutTrend: BigNumbersItem[] = [
      {
        data: [
          {
            bigNumber: { value: '1.985', measure: '%' },
            comparison: {
              label: 'vs',
              value: "Jul'25",
              number: { value: '1.1', measure: 'pp' },
            },
          },
        ],
      },
    ];

    renderComponent(dataWithoutTrend);

    expect(getBigNumberProps(0).data[0].bigNumber.color).toBeUndefined();
    expect(
      getBigNumberProps(0).data[0].comparison.number.color,
    ).toBeUndefined();
  });

  it('renders nothing when data is empty', () => {
    renderComponent([]);

    expect(mockBigNumber).not.toHaveBeenCalled();
  });

  it('omits left border when BORDER_COLORS has no entry for the index', () => {
    const dataWithThreeItems: BigNumbersItem[] = [
      ...defaultData,
      {
        data: [
          {
            bigNumber: { value: '2.0', measure: '%', trend: 'positive' },
            comparison: { label: 'vs', value: "Jul'25" },
          },
        ],
      },
    ];

    const { container } = renderComponent(dataWithThreeItems);
    const thirdItem = container.querySelectorAll('.big-number-item')[2];

    expect(thirdItem).toHaveStyle({ borderLeft: 'none' });
  });

  describe('dataTestId', () => {
    it('prefixes container, items, and BigNumber test ids when provided', () => {
      renderComponent(defaultData, 'custom');

      expect(
        document.querySelector('[data-testid="custom-container"]'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('[data-testid="custom-item-0"]'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('[data-testid="custom-item-1"]'),
      ).toBeInTheDocument();

      expect(getBigNumberProps(0).dataTestId).toBe('custom-big-number-0');
      expect(getBigNumberProps(1).dataTestId).toBe('custom-big-number-1');
    });

    it('does not pass dataTestId to BigNumber when the prop is omitted', () => {
      renderComponent(defaultData);

      expect(getBigNumberProps(0).dataTestId).toBeUndefined();
    });

    it('updates the prefixed test ids when dataTestId changes on rerender', () => {
      const { rerender, container } = render(
        <PortfolioHealthBigNumbers data={defaultData} dataTestId="initial" />,
      );

      expect(
        container.querySelector('[data-testid="initial-container"]'),
      ).toBeInTheDocument();

      rerender(
        <PortfolioHealthBigNumbers data={defaultData} dataTestId="updated" />,
      );

      expect(
        container.querySelector('[data-testid="initial-container"]'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('updated-container')).toContainElement(
        screen.getByTestId('updated-item-0'),
      );
    });

    it('indexes items beyond the two default portfolio slots', () => {
      const dataWithThreeItems: BigNumbersItem[] = [
        ...defaultData,
        { data: [{ bigNumber: { value: '3.0' } }] },
      ];

      const { container } = renderComponent(dataWithThreeItems, 'multi');

      expect(
        container.querySelector('[data-testid="multi-item-2"]'),
      ).toBeInTheDocument();
      expect(getBigNumberProps(2).dataTestId).toBe('multi-big-number-2');
    });
  });
});

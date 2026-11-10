import { render, screen } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';
import { FilterOption } from 'models/Filters';

import { ResourceHeader } from './ResourceHeader';

let capturedOnValueChange: ((val: unknown) => void) | undefined;

jest.mock('components/Form', () => ({
  Select: ({
    onValueChange,
    dataTestId,
    disabled,
  }: {
    onValueChange?: (val: unknown) => void;
    dataTestId?: string;
    disabled?: boolean;
  }) => {
    capturedOnValueChange = onValueChange;
    return (
      <div
        data-testid={dataTestId ?? 'select'}
        data-disabled={disabled ? 'true' : 'false'}
      />
    );
  },
}));

jest.mock('components', () => ({
  Tag: ({ text, dataTestId }: { text?: string; dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'tag'}>{text}</div>
  ),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(() => ({
    lastDataRefreshKpisFormated: { media: '2025-01-15' },
    data: null,
    lastDataRefreshKpis: null,
    lastDataRefreshKpisDateMonthYear: null,
    lastDataRefreshKpisDate: null,
    setData: jest.fn(),
  })),
}));

describe('ResourceHeader', () => {
  const formatMessage = jest.fn(({ id }: { id: string }) => id);
  const mockUseLastDataRefresh = jest.mocked(useLastDataRefresh);

  const optionsWithValues: FilterOption[] = [
    {
      group: '',
      values: [
        { value: 'BRA', label: 'BRA' },
        { value: 'ARG', label: 'ARG' },
      ],
    },
  ];

  const emptyOptions: FilterOption[] = [{ group: '', values: [] }];

  beforeEach(() => {
    capturedOnValueChange = undefined;
    jest.clearAllMocks();
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisFormated: { media: '2025-01-15' },
      data: null,
      lastDataRefreshKpis: null,
      lastDataRefreshKpisDateMonthYear: null,
      lastDataRefreshKpisDate: null,
      setData: jest.fn(),
    });
  });

  describe('title', () => {
    it('renders the translated section title as a heading', () => {
      render(<ResourceHeader formatMessage={formatMessage} />);

      expect(
        screen.getByRole('heading', {
          name: 'ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.sectionTitle',
        }),
      ).toBeInTheDocument();
    });
  });

  describe('comparison filter', () => {
    it('does not render the comparison filter when the prop is omitted', () => {
      render(
        <ResourceHeader
          formatMessage={formatMessage}
          dataTestId="resource-header"
        />,
      );

      expect(
        screen.queryByTestId('resource-header-comparison-filter'),
      ).not.toBeInTheDocument();
    });

    it('renders the comparison filter when the prop is provided', () => {
      render(
        <ResourceHeader
          formatMessage={formatMessage}
          comparisonFilter={{
            options: optionsWithValues,
            value: [],
            onChange: jest.fn(),
          }}
          dataTestId="resource-header"
        />,
      );

      expect(
        screen.getByTestId('resource-header-comparison-filter'),
      ).toBeInTheDocument();
    });

    it('disables the comparison filter when no group has values', () => {
      render(
        <ResourceHeader
          formatMessage={formatMessage}
          comparisonFilter={{
            options: emptyOptions,
            value: [],
            onChange: jest.fn(),
          }}
          dataTestId="resource-header"
        />,
      );

      expect(
        screen.getByTestId('resource-header-comparison-filter'),
      ).toHaveAttribute('data-disabled', 'true');
    });

    it('enables the comparison filter when at least one group has values', () => {
      render(
        <ResourceHeader
          formatMessage={formatMessage}
          comparisonFilter={{
            options: optionsWithValues,
            value: [],
            onChange: jest.fn(),
          }}
          dataTestId="resource-header"
        />,
      );

      expect(
        screen.getByTestId('resource-header-comparison-filter'),
      ).toHaveAttribute('data-disabled', 'false');
    });

    it('forwards an array of string values to onChange when the Select emits string items', () => {
      const onChange = jest.fn();

      render(
        <ResourceHeader
          formatMessage={formatMessage}
          comparisonFilter={{
            options: optionsWithValues,
            value: [],
            onChange,
          }}
          dataTestId="resource-header"
        />,
      );

      capturedOnValueChange?.(['BRA', 'ARG']);

      expect(onChange).toHaveBeenCalledWith(['BRA', 'ARG']);
    });

    it('extracts the string value when the Select emits an array of option objects', () => {
      const onChange = jest.fn();

      render(
        <ResourceHeader
          formatMessage={formatMessage}
          comparisonFilter={{
            options: optionsWithValues,
            value: [],
            onChange,
          }}
          dataTestId="resource-header"
        />,
      );

      capturedOnValueChange?.([
        { value: 'BRA', label: 'BRA' },
        { value: 'ARG', label: 'ARG' },
      ]);

      expect(onChange).toHaveBeenCalledWith(['BRA', 'ARG']);
    });

    it('calls onChange with an empty array when the Select emits a non-array value', () => {
      const onChange = jest.fn();

      render(
        <ResourceHeader
          formatMessage={formatMessage}
          comparisonFilter={{
            options: optionsWithValues,
            value: [],
            onChange,
          }}
          dataTestId="resource-header"
        />,
      );

      capturedOnValueChange?.('BRA');

      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('last data refresh tag', () => {
    it('renders the Tag when lastDataRefresh is available', () => {
      render(
        <ResourceHeader
          formatMessage={formatMessage}
          dataTestId="resource-header"
        />,
      );

      expect(
        screen.getByTestId('resource-header-last-data-refresh-tag'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('resource-header-last-data-refresh-tag'),
      ).toHaveTextContent(': 2025-01-15');
    });

    it('does not render the Tag when lastDataRefresh is not available', () => {
      mockUseLastDataRefresh.mockReturnValue({
        lastDataRefreshKpisFormated: null,
        data: null,
        lastDataRefreshKpis: null,
        lastDataRefreshKpisDateMonthYear: null,
        lastDataRefreshKpisDate: null,
        setData: jest.fn(),
      });

      render(
        <ResourceHeader
          formatMessage={formatMessage}
          dataTestId="resource-header"
        />,
      );

      expect(
        screen.queryByTestId('resource-header-last-data-refresh-tag'),
      ).not.toBeInTheDocument();
    });

    it('does not render the Tag dataTestId when dataTestId prop is omitted', () => {
      render(<ResourceHeader formatMessage={formatMessage} />);

      expect(
        screen.queryByTestId('resource-header-last-data-refresh-tag'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('tag')).toBeInTheDocument();
    });
  });
});

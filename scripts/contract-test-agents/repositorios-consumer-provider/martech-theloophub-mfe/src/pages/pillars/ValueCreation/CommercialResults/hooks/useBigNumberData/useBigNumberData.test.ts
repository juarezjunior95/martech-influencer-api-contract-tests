import { act, renderHook } from '@testing-library/react-hooks';

import { useBigNumberData } from './useBigNumberData';

const PERIOD_VALUES = ['YTD', 'L3M', 'MTD'] as const;

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockOnFilterChange = jest.fn();

const defaultProps = {
  formatMessage: mockFormatMessage,
  periodValues: PERIOD_VALUES,
  appliedPeriods: 'YTD',
  onFilterChange: mockOnFilterChange,
};

function renderUseBigNumberData(props: Partial<typeof defaultProps> = {}) {
  return renderHook(() => useBigNumberData({ ...defaultProps, ...props }));
}

describe('useBigNumberData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('title', () => {
    it('calls formatMessage with the correct id', () => {
      renderUseBigNumberData();

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ValueCreation.CommercialResults.bigNumbers.title',
      });
    });

    it('returns the value provided by formatMessage as title', () => {
      mockFormatMessage.mockReturnValue('Big Numbers Title');

      const { result } = renderUseBigNumberData();

      expect(result.current.title).toBe('Big Numbers Title');
    });

    it('recomputes title when formatMessage reference changes', () => {
      const first = jest.fn(() => 'First');
      const { result, rerender } = renderHook(
        ({ fm }) => useBigNumberData({ ...defaultProps, formatMessage: fm }),
        { initialProps: { fm: first } },
      );

      expect(result.current.title).toBe('First');

      const second = jest.fn(() => 'Second');
      rerender({ fm: second });

      expect(result.current.title).toBe('Second');
    });
  });

  describe('selectedBigNumberIndex', () => {
    it('returns 0 when appliedPeriods matches the first period', () => {
      const { result } = renderUseBigNumberData({ appliedPeriods: 'YTD' });

      expect(result.current.selectedBigNumberIndex).toBe(0);
    });

    it('returns the correct index for a middle period', () => {
      const { result } = renderUseBigNumberData({ appliedPeriods: 'L3M' });

      expect(result.current.selectedBigNumberIndex).toBe(1);
    });

    it('returns the correct index for the last period', () => {
      const { result } = renderUseBigNumberData({ appliedPeriods: 'MTD' });

      expect(result.current.selectedBigNumberIndex).toBe(2);
    });

    it('returns 0 when appliedPeriods is not found in periodValues', () => {
      const { result } = renderUseBigNumberData({
        appliedPeriods: 'UNKNOWN',
      });

      expect(result.current.selectedBigNumberIndex).toBe(0);
    });

    it('returns 0 when appliedPeriods is empty string', () => {
      const { result } = renderUseBigNumberData({ appliedPeriods: '' });

      expect(result.current.selectedBigNumberIndex).toBe(0);
    });

    it('updates when appliedPeriods prop changes', () => {
      const { result, rerender } = renderHook(
        ({ period }) =>
          useBigNumberData({ ...defaultProps, appliedPeriods: period }),
        { initialProps: { period: 'YTD' } },
      );

      expect(result.current.selectedBigNumberIndex).toBe(0);

      rerender({ period: 'L3M' });

      expect(result.current.selectedBigNumberIndex).toBe(1);
    });
  });

  describe('handleBigNumbersSelect', () => {
    it('calls onFilterChange with "periods" and the matching periodValue', () => {
      const { result } = renderUseBigNumberData();

      act(() => {
        result.current.handleBigNumbersSelect(0);
      });

      expect(mockOnFilterChange).toHaveBeenCalledWith('periods', 'YTD');
    });

    it('calls onFilterChange with the correct period for index 1', () => {
      const { result } = renderUseBigNumberData();

      act(() => {
        result.current.handleBigNumbersSelect(1);
      });

      expect(mockOnFilterChange).toHaveBeenCalledWith('periods', 'L3M');
    });

    it('calls onFilterChange with the correct period for the last index', () => {
      const { result } = renderUseBigNumberData();

      act(() => {
        result.current.handleBigNumbersSelect(2);
      });

      expect(mockOnFilterChange).toHaveBeenCalledWith('periods', 'MTD');
    });

    it('does NOT call onFilterChange when the index has no corresponding mock entry', () => {
      const { result } = renderUseBigNumberData();

      act(() => {
        result.current.handleBigNumbersSelect(99);
      });

      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });

    it('calls onFilterChange once per invocation', () => {
      const { result } = renderUseBigNumberData();

      act(() => {
        result.current.handleBigNumbersSelect(0);
        result.current.handleBigNumbersSelect(1);
      });

      expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
    });
  });
});

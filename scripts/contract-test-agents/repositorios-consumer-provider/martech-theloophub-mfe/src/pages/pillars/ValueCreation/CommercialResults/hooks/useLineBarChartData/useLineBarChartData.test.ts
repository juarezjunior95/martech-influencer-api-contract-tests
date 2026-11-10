import { renderHook } from '@testing-library/react-hooks';

import { useLineBarChartData } from './useLineBarChartData';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);

const defaultProps = {
  formatMessage: mockFormatMessage,
  applied: { periods: 'YTD', brand: 'Brahma' } as any,
};

function renderUseLineBarChartData(props: Partial<typeof defaultProps> = {}) {
  return renderHook(() => useLineBarChartData({ ...defaultProps, ...props }));
}

describe('useLineBarChartData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('return shape', () => {
    it('returns all expected keys with correct static values', () => {
      const { result } = renderUseLineBarChartData();

      expect(result.current).toMatchObject({
        title: expect.any(String),
        subtitle: { prefix: expect.any(String), value: expect.any(String) },
        data: expect.any(Object),
        loading: false,
        error: null,
        showLineDataLabels: true,
      });
    });
  });

  describe('title', () => {
    it('calls formatMessage with the correct id', () => {
      renderUseLineBarChartData();

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ValueCreation.CommercialResults.performance.lineBarChart.title',
      });
    });

    it('returns the value provided by formatMessage as title', () => {
      mockFormatMessage.mockReturnValue('Line Bar Chart Title');

      const { result } = renderUseLineBarChartData();

      expect(result.current.title).toBe('Line Bar Chart Title');
    });

    describe('subtitle', () => {
      it('calls formatMessage with the subtitle prefix id', () => {
        renderUseLineBarChartData();

        expect(mockFormatMessage).toHaveBeenCalledWith({
          id: 'ValueCreation.CommercialResults.performance.lineBarChart.subtitlePrefix',
        });
      });
    });
  });
});

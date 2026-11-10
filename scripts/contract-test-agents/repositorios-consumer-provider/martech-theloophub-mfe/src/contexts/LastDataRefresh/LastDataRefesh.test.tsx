import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { LastDataRefreshProvider, useLastDataRefresh } from './LastDataRefresh';

jest.mock('services', () => ({
  BffService: {
    getInstance: jest.fn().mockReturnValue({
      getData: jest.fn().mockResolvedValue({
        data: {
          data: {
            finance: '01-01-2024',
            volume: '02-01-2024',
            p4w: '03-01-2024',
            power: '04-01-2024',
            pos: '05-01-2024',
            market_share: '06-01-2024',
            media: '07-01-2024',
            growth_league: '08-01-2024',
          },
        },
      }),
    }),
  },
}));

jest.mock('utils/storage', () => ({
  manageLocalStorage: jest.fn((key, defaultValue) => {
    let storedValue = defaultValue;
    return [
      () => storedValue,
      (newValue) => {
        storedValue = newValue;
        return newValue;
      },
    ];
  }),
}));

const MockConsumerComponent = () => {
  const { lastDataRefreshKpisFormated, lastDataRefreshKpis, data, setData } =
    useLastDataRefresh();
  return (
    <div>
      <div data-testid="formatted-data">
        {lastDataRefreshKpisFormated.volume || 'No Data'}
      </div>
      <div data-testid="raw-data">
        {lastDataRefreshKpis.volume || 'No Data'}
      </div>
      <div data-testid="context-data">{data?.volume || 'No Data'}</div>
      <button
        data-testid="update-button"
        onClick={() => setData({ volume: '15-04-2024' })}
      >
        Update Data
      </button>
    </div>
  );
};

describe('LastDataRefreshContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders provider and provides default values', () => {
    render(
      <LastDataRefreshProvider>
        <MockConsumerComponent />
      </LastDataRefreshProvider>,
    );

    expect(screen.getByTestId('formatted-data')).toHaveTextContent('No Data');
    expect(screen.getByTestId('raw-data')).toHaveTextContent('No Data');
    expect(screen.getByTestId('context-data')).toHaveTextContent('No Data');
  });

  it('allows manual data updates through setData', async () => {
    render(
      <LastDataRefreshProvider>
        <MockConsumerComponent />
      </LastDataRefreshProvider>,
    );

    const updateButton = screen.getByTestId('update-button');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByTestId('formatted-data')).toHaveTextContent(
        'Apr - 2024',
      );
      expect(screen.getByTestId('raw-data')).toHaveTextContent('15-04-2024');
      expect(screen.getByTestId('context-data')).toHaveTextContent(
        '15-04-2024',
      );
    });
  });
});

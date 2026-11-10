import { FC } from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import {
  useVolumePagesKpi,
  VolumePagesKpiProvider,
} from './VolumePagesKpiContext';

const intlMessages = {
  'ValueCreation.PRPages.volume': 'Volume',
  'ValueCreation.PRPages.nr': 'Net Revenue',
};

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={intlMessages}>
    {children}
  </IntlProvider>
);

const KpiConsumer: FC = () => {
  const { kpi, kpiName } = useVolumePagesKpi();
  return (
    <>
      <div data-testid="kpi-value">{kpi}</div>
      <div data-testid="kpi-name">{kpiName}</div>
    </>
  );
};

describe('VolumePagesKpiProvider', () => {
  it('renders its children', () => {
    render(
      <AllProviders>
        <VolumePagesKpiProvider kpi="volume">
          <div data-testid="child" />
        </VolumePagesKpiProvider>
      </AllProviders>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides kpi and kpiName to consumers', () => {
    render(
      <AllProviders>
        <VolumePagesKpiProvider kpi="nr">
          <KpiConsumer />
        </VolumePagesKpiProvider>
      </AllProviders>,
    );

    expect(screen.getByTestId('kpi-value')).toHaveTextContent('nr');
    expect(screen.getByTestId('kpi-name')).toHaveTextContent('Net Revenue');

    {
    }
  });
});

describe('useVolumePagesKpi', () => {
  it('throws when used outside VolumePagesKpiProvider', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    expect(() => render(<KpiConsumer />)).toThrow(
      'useVolumePagesKpi must be used within VolumePagesKpiProvider',
    );

    consoleError.mockRestore();
  });
});

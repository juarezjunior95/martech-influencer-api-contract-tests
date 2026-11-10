import { screen } from '@testing-library/react';
import { render } from 'utils/test/test-utils';

import { SubFilterBreakdowns } from './SubFilterBreakdowns';

jest.mock('./SubFilterBreakdowns.styles', () => ({
  SubFilterBreakdownsBox: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'breakdowns-box'}>{children}</div>
  ),
  SubFilterBreakdownsSelects: ({
    children,
    'data-testid': dataTestId,
  }: any) => <div data-testid={dataTestId}>{children}</div>,
}));

describe('SubFilterBreakdowns Component', () => {
  it('renderiza os componentes SubFilterField corretamente', () => {
    const mockState = {
      filters: {
        activeSubFilters: {
          'breakdown-select-groups': 'grupo-exemplo',
          'pp-breakdown': 'volume',
          'ytd-month': 'ytd',
        },
      },
    };

    render(<SubFilterBreakdowns />, mockState);

    expect(screen.getByTestId('breakdowns-box')).toBeInTheDocument();
  });

  it('renderiza com o valor padrão "region" quando nenhum valor é especificado e zones selecionado no segundo dropdown', () => {
    const mockState = {
      filters: {
        activeSubFilters: {
          'breakdown-select-groups': 'region',
          'breakdown-regions': 'zones',
          'pp-breakdown': 'volume',
          'ytd-month': 'ytd',
        },
      },
    };

    render(<SubFilterBreakdowns />, mockState);

    expect(screen.getByTestId('breakdowns-box')).toBeInTheDocument();
  });

  it('should apply data-testid when dataTestId prop is provided', () => {
    const mockState = {
      filters: {
        activeSubFilters: {
          'breakdown-select-groups': 'region',
          'pp-breakdown': 'volume',
        },
      },
    };

    render(<SubFilterBreakdowns dataTestId="custom-breakdowns" />, mockState);

    expect(screen.getByTestId('custom-breakdowns')).toBeInTheDocument();
  });
});

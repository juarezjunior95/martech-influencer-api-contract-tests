import React from 'react';

import { render, screen } from '@testing-library/react';
import { BigNumberData } from 'components/deprecated';

import { TotalCountryResults } from './TotalCountryResults';

jest.mock('components', () => ({
  ErrorMessage: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'error-message'}>Error</div>
  ),
  Skeleton: ({
    height,
    width,
    length,
    gap,
    dataTestId,
  }: {
    height: string;
    width: string;
    length: number;
    gap: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'skeleton'}
      data-height={height}
      data-width={width}
      data-length={length}
      data-gap={gap}
    />
  ),
}));

jest.mock('../../Overview.styles', () => ({
  StyledContent: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'styled-content'}>{children}</div>,
}));

jest.mock('../BigNumberItem/BigNumberItem', () => ({
  BigNumberItem: ({
    item,
    dataTestId,
  }: {
    item: BigNumberData;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'big-number-item'}
      data-title={item.title}
    />
  ),
}));

const createMockBigNumberData = (
  overrides: Partial<BigNumberData> = {},
): BigNumberData => ({
  title: 'volume',
  bigNumber: 100,
  ...overrides,
});

describe('TotalCountryResults', () => {
  describe('loading state', () => {
    it('renders a 5-item skeleton with the expected dimensions and hides any data', () => {
      render(
        <TotalCountryResults
          data={[createMockBigNumberData()]}
          error={null}
          loading={true}
        />,
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-height', '168px');
      expect(skeleton).toHaveAttribute('data-width', '241px');
      expect(skeleton).toHaveAttribute('data-length', '5');
      expect(skeleton).toHaveAttribute('data-gap', 'medium');
      expect(screen.queryByTestId('big-number-item')).not.toBeInTheDocument();
    });
  });

  describe('error / empty state', () => {
    it('renders ErrorMessage when an error is present', () => {
      render(
        <TotalCountryResults
          data={[]}
          error={new Error('Test error')}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('big-number-item')).not.toBeInTheDocument();
    });

    it('renders ErrorMessage when data has the empty flag', () => {
      render(
        <TotalCountryResults
          data={{ empty: true }}
          error={null}
          loading={false}
        />,
      );

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.queryByTestId('big-number-item')).not.toBeInTheDocument();
    });
  });

  describe('data rendering', () => {
    it('renders one BigNumberItem per data entry, forwarding each title', () => {
      const mockData = [
        createMockBigNumberData({ title: 'volume' }),
        createMockBigNumberData({ title: 'maco' }),
        createMockBigNumberData({ title: 'nr' }),
      ];

      render(
        <TotalCountryResults data={mockData} error={null} loading={false} />,
      );

      const items = screen.getAllByTestId('big-number-item');
      expect(items.map((item) => item.dataset.title)).toEqual([
        'volume',
        'maco',
        'nr',
      ]);
    });

    it('renders the styled content but no items when the array is empty', () => {
      render(<TotalCountryResults data={[]} error={null} loading={false} />);

      expect(screen.getByTestId('styled-content')).toBeInTheDocument();
      expect(screen.queryByTestId('big-number-item')).not.toBeInTheDocument();
    });
  });

  describe('dataTestId namespacing', () => {
    it('namespaces the skeleton testid in the loading state', () => {
      render(
        <TotalCountryResults
          data={[]}
          error={null}
          loading={true}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-total-country-results'),
      ).toBeInTheDocument();
    });

    it('namespaces the error testid in the error state', () => {
      render(
        <TotalCountryResults
          data={[]}
          error={new Error('Test error')}
          loading={false}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-total-country-results-error'),
      ).toBeInTheDocument();
    });

    it('namespaces the content and BigNumberItem testids in the data state', () => {
      render(
        <TotalCountryResults
          data={[
            createMockBigNumberData({ title: 'a' }),
            createMockBigNumberData({ title: 'b' }),
          ]}
          error={null}
          loading={false}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-total-country-results-content'),
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId('custom-total-country-results'),
      ).toHaveLength(2);
    });
  });
});

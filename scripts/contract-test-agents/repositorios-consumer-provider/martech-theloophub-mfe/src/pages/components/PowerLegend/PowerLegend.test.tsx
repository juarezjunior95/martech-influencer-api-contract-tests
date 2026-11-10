import React from 'react';

import { render, screen } from '@testing-library/react';

import { PowerLegend } from './PowerLegend';

jest.mock('components', () => ({
  Legend: ({ legendPosition, font, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'legend'}
      data-legend-position={legendPosition}
      data-font={font}
    >
      Legend
    </div>
  ),
  Skeleton: ({ width, height, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'skeleton'}
      data-width={width}
      data-height={height}
    >
      Skeleton
    </div>
  ),
}));

describe('PowerLegend', () => {
  describe('PowerLegend', () => {
    const mockData = [
      { label: 'Item 1', value: 10, color: '#ff0000' },
      { label: 'Item 2', value: 20, color: '#00ff00' },
    ] as any; // ou ajuste o tipo conforme necessário

    it('should render Skeleton when loading is true', () => {
      render(<PowerLegend loading={true} data={[]} />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('should render Legend when loading is false', () => {
      render(<PowerLegend loading={false} data={mockData} />);

      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('should pass dataTestId to Skeleton when loading is true', () => {
      render(<PowerLegend loading={true} data={[]} dataTestId="custom" />);

      expect(screen.getByTestId('custom-power-legend')).toBeInTheDocument();
    });

    it('should pass dataTestId to Legend when loading is false', () => {
      render(
        <PowerLegend loading={false} data={mockData} dataTestId="custom" />,
      );

      expect(screen.getByTestId('custom-power-legend')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <PowerLegend loading={false} data={mockData} />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<PowerLegend loading={true} data={[]} />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
  });
});

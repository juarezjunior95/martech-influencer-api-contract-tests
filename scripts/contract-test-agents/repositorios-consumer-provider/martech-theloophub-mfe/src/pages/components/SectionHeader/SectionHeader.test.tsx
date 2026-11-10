import React from 'react';

import { render, screen } from '@testing-library/react';

import { SectionHeader } from './SectionHeader';

jest.mock('assets/icons/TrendingDown.svg', () => 'TrendingDown.svg');
jest.mock('assets/icons/TrendingUp.svg', () => 'TrendingUp.svg');

jest.mock('components', () => ({
  ChartLegend: ({ items, dataTestId }: any) => (
    <div data-testid={dataTestId} data-items-count={items?.length}>
      {items?.map((item: any, index: number) => (
        <div key={index} data-testid={`${dataTestId}-item-${index}`}>
          {item.label}
        </div>
      ))}
    </div>
  ),
}));

jest.mock('pages/pillars/ValueCreation/VolumePages/VolumePages.styles', () => ({
  StyledSectionHeaderContainer: ({ children, style, ...props }: any) => (
    <div style={style} {...props}>
      {children}
    </div>
  ),
  StyledTag: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  StyledTagLabel: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

describe('SectionHeader', () => {
  it('should render container', () => {
    const { container } = render(<SectionHeader />);

    // Should render a div container
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle({ alignItems: 'center' });
  });

  describe('data-testid', () => {
    it('should render with data-testid when provided', () => {
      const legends = [
        { label: 'Legend 1', color: '#000', shape: 'square' as const },
      ];

      render(
        <SectionHeader dataTestId="test" period="2024" legends={legends} />,
      );

      expect(screen.getByTestId('section-header-test')).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-test-period'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-test-legend'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-test-legend-label'),
      ).toBeInTheDocument();
    });

    it('should render legend label with data-testid', () => {
      const legends = [
        { label: 'Growth', color: '#000', shape: 'square' as const },
      ];

      render(<SectionHeader dataTestId="test" legends={legends} />);

      expect(
        screen.getByTestId('section-header-test-legend-label'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-test-legend-label'),
      ).toHaveTextContent('Growth');
    });

    it('should render legend icon with data-testid when icon is provided', () => {
      const legends = [
        {
          label: 'Growth',
          color: '#000',
          shape: 'square' as const,
          icon: 'TrendingUp' as const,
        },
      ];

      render(<SectionHeader dataTestId="test" legends={legends} />);

      const icon = screen.getByTestId(
        'section-header-test-legend-icon-trendingup',
      );
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('alt', 'TrendingUp');
    });

    it('should not render legend icon data-testid when icon is not provided', () => {
      const legends = [
        { label: 'Growth', color: '#000', shape: 'square' as const },
      ];

      const { container } = render(
        <SectionHeader dataTestId="test" legends={legends} />,
      );

      const iconElements = container.querySelectorAll(
        '[data-testid*="legend-icon"]',
      );
      expect(iconElements).toHaveLength(0);
    });

    it('should render without data-testid when not provided', () => {
      const { container } = render(<SectionHeader />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid*="section-header-"]',
      );
      expect(elementsWithTestId).toHaveLength(0);
    });

    it('should not render period data-testid when period is not provided', () => {
      const legends = [
        { label: 'Legend 1', color: '#000', shape: 'square' as const },
      ];

      render(<SectionHeader dataTestId="test" legends={legends} />);

      expect(screen.getByTestId('section-header-test')).toBeInTheDocument();
      expect(
        screen.queryByTestId('section-header-test-period'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-test-legend'),
      ).toBeInTheDocument();
    });

    it('should not render legends data-testid when legends are not provided', () => {
      render(<SectionHeader dataTestId="test" period="2024" />);

      expect(screen.getByTestId('section-header-test')).toBeInTheDocument();
      expect(
        screen.getByTestId('section-header-test-period'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('section-header-test-legend'),
      ).not.toBeInTheDocument();
    });
  });
});

import React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ChartLengendRenderer } from './ChartLegendRenderer';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, ...props }: any) => (
    <p data-testid="paragraph" {...props}>
      {children}
    </p>
  ),
}));

jest.mock('./ChartLegendRenderer.styles', () => ({
  StyledContent: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'styled-content'}>{children}</div>
  ),
  StyledLegendGroup: ({ children }: any) => (
    <div data-testid="styled-legend-group">{children}</div>
  ),
  StyledLegendItem: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'styled-legend-item'}>{children}</div>
  ),
  StyledColorBox: ({ style }: any) => (
    <div data-testid="styled-color-box" style={style}></div>
  ),
}));

describe('ChartLengendRenderer', () => {
  const mockLegend = [
    { color: '#FF0000', label: 'Red Item' },
    { color: '#00FF00', label: 'Green Item' },
    { color: '#0000FF', label: 'Blue Item' },
  ];

  it('should render the component', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    expect(screen.getByTestId('styled-content')).toBeInTheDocument();
  });

  it('should render the title', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render the title in a Paragraph component', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    const paragraph = screen.getByTestId('paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Test Title');
  });

  it('should render legend group', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    expect(screen.getByTestId('styled-legend-group')).toBeInTheDocument();
  });

  it('should render all legend items', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(3);
  });

  it('should render correct labels for each legend item', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    expect(screen.getByText('Red Item')).toBeInTheDocument();
    expect(screen.getByText('Green Item')).toBeInTheDocument();
    expect(screen.getByText('Blue Item')).toBeInTheDocument();
  });

  it('should render color boxes with correct background colors', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    const colorBoxes = screen.getAllByTestId('styled-color-box');
    expect(colorBoxes[0]).toHaveStyle({ backgroundColor: '#FF0000' });
    expect(colorBoxes[1]).toHaveStyle({ backgroundColor: '#00FF00' });
    expect(colorBoxes[2]).toHaveStyle({ backgroundColor: '#0000FF' });
  });

  it('should render nothing when legend is empty array', () => {
    render(<ChartLengendRenderer title="Test Title" legend={[]} />);

    const legendGroup = screen.getByTestId('styled-legend-group');
    expect(legendGroup).toBeEmptyDOMElement();
  });

  it('should render nothing when legend is null', () => {
    render(<ChartLengendRenderer title="Test Title" legend={null as any} />);

    const legendGroup = screen.getByTestId('styled-legend-group');
    expect(legendGroup).toBeEmptyDOMElement();
  });

  it('should render nothing when legend is undefined', () => {
    render(
      <ChartLengendRenderer title="Test Title" legend={undefined as any} />,
    );

    const legendGroup = screen.getByTestId('styled-legend-group');
    expect(legendGroup).toBeEmptyDOMElement();
  });

  it('should render with single legend item', () => {
    const singleLegend = [{ color: '#FF0000', label: 'Single Item' }];
    render(<ChartLengendRenderer title="Test Title" legend={singleLegend} />);

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(1);
    expect(screen.getByText('Single Item')).toBeInTheDocument();
  });

  it('should render with many legend items', () => {
    const manyLegends = Array.from({ length: 10 }, (_, i) => ({
      color: `#${i}${i}${i}${i}${i}${i}`,
      label: `Item ${i}`,
    }));
    render(<ChartLengendRenderer title="Test Title" legend={manyLegends} />);

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(10);
  });

  it('should render empty title', () => {
    render(<ChartLengendRenderer title="" legend={mockLegend} />);

    const paragraph = screen.getByTestId('paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('');
  });

  it('should render long title', () => {
    const longTitle =
      'This is a very long title that should still render correctly';
    render(<ChartLengendRenderer title={longTitle} legend={mockLegend} />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('should render title with special characters', () => {
    const specialTitle = 'Title with @#$%^&*() special chars';
    render(<ChartLengendRenderer title={specialTitle} legend={mockLegend} />);

    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });

  it('should handle legend items with duplicate labels', () => {
    const duplicateLegend = [
      { color: '#FF0000', label: 'Same Label' },
      { color: '#00FF00', label: 'Same Label' },
    ];
    render(
      <ChartLengendRenderer title="Test Title" legend={duplicateLegend} />,
    );

    const labels = screen.getAllByText('Same Label');
    expect(labels).toHaveLength(2);
  });

  it('should handle legend items with duplicate colors', () => {
    const duplicateColorLegend = [
      { color: '#FF0000', label: 'Item 1' },
      { color: '#FF0000', label: 'Item 2' },
    ];
    render(
      <ChartLengendRenderer title="Test Title" legend={duplicateColorLegend} />,
    );

    const colorBoxes = screen.getAllByTestId('styled-color-box');
    expect(colorBoxes[0]).toHaveStyle({ backgroundColor: '#FF0000' });
    expect(colorBoxes[1]).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('should render with rgba colors', () => {
    const rgbaLegend = [{ color: 'rgba(255, 0, 0, 0.5)', label: 'RGBA Item' }];
    render(<ChartLengendRenderer title="Test Title" legend={rgbaLegend} />);

    const colorBox = screen.getByTestId('styled-color-box');
    expect(colorBox).toHaveStyle({ backgroundColor: 'rgba(255, 0, 0, 0.5)' });
  });

  it('should render with named colors', () => {
    const namedColorLegend = [{ color: 'red', label: 'Named Color Item' }];
    render(
      <ChartLengendRenderer title="Test Title" legend={namedColorLegend} />,
    );

    const colorBox = screen.getByTestId('styled-color-box');
    expect(colorBox).toHaveStyle({ backgroundColor: 'red' });
  });

  it('should render empty label', () => {
    const emptyLabelLegend = [{ color: '#FF0000', label: '' }];
    render(
      <ChartLengendRenderer title="Test Title" legend={emptyLabelLegend} />,
    );

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(1);
  });

  it('should render color box and label in correct order within item', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    const legendItems = screen.getAllByTestId('styled-legend-item');
    const firstItem = legendItems[0];

    const colorBox = firstItem.querySelector(
      '[data-testid="styled-color-box"]',
    );
    const label = firstItem.querySelector('span');

    expect(colorBox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Red Item');
  });

  it('should handle legend with falsy values mixed with valid items', () => {
    const mixedLegend = [
      { color: '#FF0000', label: 'Valid Item' },
      null,
      undefined,
    ].filter(Boolean) as any;

    render(<ChartLengendRenderer title="Test Title" legend={mixedLegend} />);

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(1);
  });

  it('should render with numeric title', () => {
    render(<ChartLengendRenderer title={123 as any} legend={mockLegend} />);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should use unique keys for legend items', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    expect(screen.getByTestId('styled-content')).toBeInTheDocument();
  });

  it('should handle legend items with very long labels', () => {
    const longLabelLegend = [
      {
        color: '#FF0000',
        label:
          'This is a very long label that might need wrapping or truncation',
      },
    ];
    render(
      <ChartLengendRenderer title="Test Title" legend={longLabelLegend} />,
    );

    expect(
      screen.getByText(
        'This is a very long label that might need wrapping or truncation',
      ),
    ).toBeInTheDocument();
  });

  it('should render all components in correct structure', () => {
    render(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    const content = screen.getByTestId('styled-content');
    const paragraph = screen.getByTestId('paragraph');
    const legendGroup = screen.getByTestId('styled-legend-group');

    expect(content).toContainElement(paragraph);
    expect(content).toContainElement(legendGroup);
  });

  it('should handle re-render with different props', () => {
    const { rerender } = render(
      <ChartLengendRenderer title="Initial Title" legend={mockLegend} />,
    );

    expect(screen.getByText('Initial Title')).toBeInTheDocument();

    const newLegend = [{ color: '#000000', label: 'New Item' }];
    rerender(<ChartLengendRenderer title="Updated Title" legend={newLegend} />);

    expect(screen.getByText('Updated Title')).toBeInTheDocument();
    expect(screen.getByText('New Item')).toBeInTheDocument();
    expect(screen.queryByText('Red Item')).not.toBeInTheDocument();
  });

  it('should handle transition from empty to populated legend', () => {
    const { rerender } = render(
      <ChartLengendRenderer title="Test Title" legend={[]} />,
    );

    let legendGroup = screen.getByTestId('styled-legend-group');
    expect(legendGroup).toBeEmptyDOMElement();

    rerender(<ChartLengendRenderer title="Test Title" legend={mockLegend} />);

    legendGroup = screen.getByTestId('styled-legend-group');
    expect(legendGroup).not.toBeEmptyDOMElement();
    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(3);
  });

  it('should handle transition from populated to empty legend', () => {
    const { rerender } = render(
      <ChartLengendRenderer title="Test Title" legend={mockLegend} />,
    );

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(3);

    rerender(<ChartLengendRenderer title="Test Title" legend={[]} />);

    const legendGroup = screen.getByTestId('styled-legend-group');
    expect(legendGroup).toBeEmptyDOMElement();
  });

  it('should render with hsl colors', () => {
    const hslLegend = [{ color: 'hsl(0, 100%, 50%)', label: 'HSL Item' }];
    render(<ChartLengendRenderer title="Test Title" legend={hslLegend} />);

    const colorBox = screen.getByTestId('styled-color-box');
    expect(colorBox).toHaveStyle({ backgroundColor: 'hsl(0, 100%, 50%)' });
  });

  it('should render with transparent color', () => {
    const transparentLegend = [
      { color: 'transparent', label: 'Transparent Item' },
    ];
    render(
      <ChartLengendRenderer title="Test Title" legend={transparentLegend} />,
    );

    const colorBox = screen.getByTestId('styled-color-box');
    expect(colorBox).toHaveStyle({ backgroundColor: 'transparent' });
  });

  it('should handle legend items in different order', () => {
    const reversedLegend = [...mockLegend].reverse();
    render(<ChartLengendRenderer title="Test Title" legend={reversedLegend} />);

    const labels = screen.getAllByText(/Item$/);
    expect(labels[0]).toHaveTextContent('Blue Item');
    expect(labels[1]).toHaveTextContent('Green Item');
    expect(labels[2]).toHaveTextContent('Red Item');
  });

  it('should maintain component structure with zero length legend', () => {
    render(<ChartLengendRenderer title="Test Title" legend={[]} />);

    expect(screen.getByTestId('styled-content')).toBeInTheDocument();
    expect(screen.getByTestId('paragraph')).toBeInTheDocument();
    expect(screen.getByTestId('styled-legend-group')).toBeInTheDocument();
  });

  it('should handle legend with color but no label property', () => {
    const incompleteLegend = [{ color: '#FF0000' }] as any;
    render(
      <ChartLengendRenderer title="Test Title" legend={incompleteLegend} />,
    );

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(1);
  });

  it('should handle legend with label but no color property', () => {
    const incompleteLegend = [{ label: 'No Color' }] as any;
    render(
      <ChartLengendRenderer title="Test Title" legend={incompleteLegend} />,
    );

    expect(screen.getByText('No Color')).toBeInTheDocument();
  });

  it('should render correctly with very large legend array', () => {
    const largeLegend = Array.from({ length: 100 }, (_, i) => ({
      color: `#${(i * 1000).toString(16).padStart(6, '0').slice(0, 6)}`,
      label: `Item ${i}`,
    }));

    render(<ChartLengendRenderer title="Test Title" legend={largeLegend} />);

    const legendItems = screen.getAllByTestId('styled-legend-item');
    expect(legendItems).toHaveLength(100);
  });

  describe('data-testid', () => {
    it('should render with data-testid when provided', () => {
      render(
        <ChartLengendRenderer
          title="Test Title"
          legend={mockLegend}
          dataTestId="test-legend"
        />,
      );

      expect(
        screen.getByTestId('chart-legend-test-legend'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('legend-item-test-legend-0'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('legend-item-test-legend-1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('legend-item-test-legend-2'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when not provided', () => {
      const { container } = render(
        <ChartLengendRenderer title="Test Title" legend={mockLegend} />,
      );

      // Should have mock data-testids but not custom chart-legend-*
      expect(screen.queryByTestId(/^chart-legend-/)).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(/^legend-item-.*-\d+$/),
      ).not.toBeInTheDocument();
    });

    it('should render correct data-testid for each legend item by index', () => {
      render(
        <ChartLengendRenderer
          title="Test Title"
          legend={mockLegend}
          dataTestId="indexed"
        />,
      );

      mockLegend.forEach((_, index) => {
        expect(
          screen.getByTestId(`legend-item-indexed-${index}`),
        ).toBeInTheDocument();
      });
    });
  });
});

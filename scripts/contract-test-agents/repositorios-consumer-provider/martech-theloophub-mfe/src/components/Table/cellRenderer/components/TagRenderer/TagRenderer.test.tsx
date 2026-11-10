import React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TagRenderer } from './TagRenderer';

jest.mock('./TagRenderer.styles', () => ({
  StyledTag: ({ children, style, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'styled-tag'} style={style}>
      {children}
    </div>
  ),
}));

describe('TagRenderer', () => {
  const mockTagData = {
    color: '#FF0000',
    backgroundColor: '#FFCCCC',
    value: 'Test Tag',
    unitOfMeasure: '%',
  };

  it('should render the component', () => {
    render(<TagRenderer tagData={mockTagData} />);

    expect(screen.getByTestId('styled-tag')).toBeInTheDocument();
  });

  it('should render tag value', () => {
    render(<TagRenderer tagData={mockTagData} />);

    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  it('should apply backgroundColor to StyledTag', () => {
    render(<TagRenderer tagData={mockTagData} />);

    const styledTag = screen.getByTestId('styled-tag');
    expect(styledTag).toHaveStyle({ backgroundColor: '#FFCCCC' });
  });

  it('should apply color to value span', () => {
    const { container } = render(<TagRenderer tagData={mockTagData} />);

    const valueSpan = container.querySelector('span[style*="color"]');
    expect(valueSpan).toHaveStyle({ color: '#FF0000' });
  });

  it('should render unitOfMeasure when provided', () => {
    render(<TagRenderer tagData={mockTagData} />);

    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('should not render unitOfMeasure when not provided', () => {
    const tagDataWithoutUnit = {
      color: '#FF0000',
      backgroundColor: '#FFCCCC',
      value: 'Tag',
    };

    const { container } = render(<TagRenderer tagData={tagDataWithoutUnit} />);

    expect(container.textContent).toBe('Tag ');
  });

  it('should render with different colors', () => {
    const customTagData = {
      color: '#0000FF',
      backgroundColor: '#CCCCFF',
      value: 'Blue Tag',
    };

    render(<TagRenderer tagData={customTagData} />);

    const styledTag = screen.getByTestId('styled-tag');
    expect(styledTag).toHaveStyle({ backgroundColor: '#CCCCFF' });
  });

  it('should render with numeric value', () => {
    const numericTagData = {
      color: '#000000',
      backgroundColor: '#FFFFFF',
      value: '42',
      unitOfMeasure: 'pts',
    };

    render(<TagRenderer tagData={numericTagData} />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('pts')).toBeInTheDocument();
  });

  it('should render with empty value', () => {
    const emptyValueData = {
      color: '#000000',
      backgroundColor: '#FFFFFF',
      value: '',
    };

    render(<TagRenderer tagData={emptyValueData} />);

    expect(screen.getByTestId('styled-tag')).toBeInTheDocument();
  });

  it('should render complete structure', () => {
    const { container } = render(<TagRenderer tagData={mockTagData} />);

    expect(
      container.querySelector('[data-testid="styled-tag"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('span[style*="color"]')).toBeInTheDocument();
  });

  describe('data-testid', () => {
    it('should render with data-testid when provided', () => {
      render(<TagRenderer tagData={mockTagData} dataTestId="test-tag" />);

      expect(screen.getByTestId('tag-test-tag')).toBeInTheDocument();
      expect(screen.getByTestId('tag-test-tag')).toHaveTextContent('Test Tag');
      expect(screen.getByTestId('tag-test-tag')).toHaveTextContent('%');
    });

    it('should not render custom data-testid when not provided', () => {
      const { container } = render(<TagRenderer tagData={mockTagData} />);

      // Should have the default mock data-testid but not a custom one
      expect(screen.getByTestId('styled-tag')).toBeInTheDocument();
      expect(screen.queryByTestId('tag-')).not.toBeInTheDocument();
    });

    it('should render data-testid with different values', () => {
      const { rerender } = render(
        <TagRenderer tagData={mockTagData} dataTestId="first" />,
      );
      expect(screen.getByTestId('tag-first')).toBeInTheDocument();

      rerender(<TagRenderer tagData={mockTagData} dataTestId="second" />);
      expect(screen.getByTestId('tag-second')).toBeInTheDocument();
      expect(screen.queryByTestId('tag-first')).not.toBeInTheDocument();
    });
  });
});

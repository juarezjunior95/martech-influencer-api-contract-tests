import React from 'react';

import { render, screen } from '@testing-library/react';

import { DoubleValueContainer } from './DoubleValueContainer';

jest.mock('utils/getColor', () => ({
  getVariationColor: jest.fn((direction) => {
    if (direction === 'up') return 'green';
    if (direction === 'down') return 'red';
    return 'gray';
  }),
}));

describe('DoubleValueContainer', () => {
  it('should render container with ag-cell-double-value class', () => {
    const { container } = render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="up"
      />,
    );

    expect(
      container.querySelector('.ag-cell-double-value'),
    ).toBeInTheDocument();
  });

  it('should render first value with unit measure', () => {
    render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="up"
      />,
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should render second value with unit measure', () => {
    render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="up"
      />,
    );

    expect(screen.getByText('50pp')).toBeInTheDocument();
  });

  it('should apply green color for up direction', () => {
    render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="up"
      />,
    );

    const secondSpan = screen.getByText('50pp');
    expect(secondSpan).toHaveStyle({ color: 'green' });
  });

  it('should apply red color for down direction', () => {
    render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="down"
      />,
    );

    const secondSpan = screen.getByText('50pp');
    expect(secondSpan).toHaveStyle({ color: 'red' });
  });

  it('should apply gray color for neutral direction', () => {
    render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="neutral"
      />,
    );

    const secondSpan = screen.getByText('50pp');
    expect(secondSpan).toHaveStyle({ color: 'gray' });
  });

  it('should render with flex column layout', () => {
    const { container } = render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="up"
      />,
    );

    const div = container.querySelector('.ag-cell-double-value');
    expect(div).toHaveStyle({ display: 'flex', flexDirection: 'column' });
  });

  it('should render with center text alignment', () => {
    const { container } = render(
      <DoubleValueContainer
        value="100"
        value2="50"
        unitMeasure="%"
        unitMeasure2="pp"
        variationDirection2="up"
      />,
    );

    const div = container.querySelector('.ag-cell-double-value');
    expect(div).toHaveStyle({ textAlign: 'center' });
  });

  describe('data-testid Rendering', () => {
    it('should render container with data-testid when provided', () => {
      render(
        <DoubleValueContainer
          dataTestId="custom"
          value="100"
          value2="50"
          unitMeasure="%"
          unitMeasure2="pp"
          variationDirection2="up"
        />,
      );

      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('should render first value with data-testid when provided', () => {
      render(
        <DoubleValueContainer
          dataTestId="custom"
          value="100"
          value2="50"
          unitMeasure="%"
          unitMeasure2="pp"
          variationDirection2="up"
        />,
      );

      expect(screen.getByTestId('custom-value')).toBeInTheDocument();
      expect(screen.getByTestId('custom-value')).toHaveTextContent('100%');
    });

    it('should render second value with data-testid when provided', () => {
      render(
        <DoubleValueContainer
          dataTestId="custom"
          value="100"
          value2="50"
          unitMeasure="%"
          unitMeasure2="pp"
          variationDirection2="up"
        />,
      );

      expect(screen.getByTestId('custom-value2')).toBeInTheDocument();
      expect(screen.getByTestId('custom-value2')).toHaveTextContent('50pp');
    });

    it('should not render data-testid when not provided', () => {
      const { container } = render(
        <DoubleValueContainer
          value="100"
          value2="50"
          unitMeasure="%"
          unitMeasure2="pp"
          variationDirection2="up"
        />,
      );

      const elementsWithTestId = container.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});

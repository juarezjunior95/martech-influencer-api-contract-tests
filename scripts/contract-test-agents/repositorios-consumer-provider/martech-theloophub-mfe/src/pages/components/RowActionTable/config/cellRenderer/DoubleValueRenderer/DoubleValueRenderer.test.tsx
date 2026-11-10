import React from 'react';

import { render, screen } from '@testing-library/react';

import { DoubleValueRenderer } from './DoubleValueRenderer';

jest.mock('utils/format', () => ({
  formatNumber: jest.fn((num) => `formatted_${num}`),
}));

jest.mock('utils/regex', () => ({
  isNumber: {
    test: jest.fn((val) => typeof val === 'number'),
  },
}));

jest.mock('./components/DoubleValueContainer', () => ({
  DoubleValueContainer: ({
    value,
    value2,
    unitMeasure,
    unitMeasure2,
    variationDirection2,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'double-value-container'}
      data-value={value}
      data-value2={value2}
      data-unit-measure={unitMeasure}
      data-unit-measure2={unitMeasure2}
      data-variation-direction2={variationDirection2}
    >
      DoubleValueContainer
    </div>
  ),
}));

describe('DoubleValueRenderer', () => {
  const createParams = (value: any, config?: any) =>
    ({
      colDef: { field: 'test_field' },
      data: {
        test_field_config: config,
      },
      value,
    }) as any;

  it('should render div with ag-cell-content class', () => {
    const params = createParams('100', {});

    const { container } = render(DoubleValueRenderer(params));

    expect(container.querySelector('.ag-cell-content')).toBeInTheDocument();
  });

  it('should render DoubleValueContainer', () => {
    const params = createParams('100', {});

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toBeInTheDocument();
  });

  it('should format numeric value', () => {
    const params = createParams(100, {
      value2: 'text',
      unitMeasure: '%',
      unitMeasure2: 'pp',
      variationDirection2: 'up',
    });

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toHaveAttribute(
      'data-value',
      'formatted_100',
    );
  });

  it('should not format string value', () => {
    const params = createParams('text value', {
      value2: 'text2',
      unitMeasure: '%',
      unitMeasure2: 'pp',
      variationDirection2: 'up',
    });

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toHaveAttribute(
      'data-value',
      'text value',
    );
  });

  it('should format numeric value2', () => {
    const params = createParams('100', {
      value2: 50,
      unitMeasure: '%',
      unitMeasure2: 'pp',
      variationDirection2: 'up',
    });

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toHaveAttribute(
      'data-value2',
      'formatted_50',
    );
  });

  it('should not format string value2', () => {
    const params = createParams('100', {
      value2: 'text2',
      unitMeasure: '%',
      unitMeasure2: 'pp',
      variationDirection2: 'up',
    });

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toHaveAttribute(
      'data-value2',
      'text2',
    );
  });

  it('should pass unitMeasure to DoubleValueContainer', () => {
    const params = createParams('100', {
      value2: '50',
      unitMeasure: '%',
      unitMeasure2: 'pp',
      variationDirection2: 'up',
    });

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toHaveAttribute(
      'data-unit-measure',
      '%',
    );
  });

  it('should pass unitMeasure2 to DoubleValueContainer', () => {
    const params = createParams('100', {
      value2: '50',
      unitMeasure: '%',
      unitMeasure2: 'pp',
      variationDirection2: 'up',
    });

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toHaveAttribute(
      'data-unit-measure2',
      'pp',
    );
  });

  it('should pass variationDirection2 to DoubleValueContainer', () => {
    const params = createParams('100', {
      value2: '50',
      unitMeasure: '%',
      unitMeasure2: 'pp',
      variationDirection2: 'down',
    });

    render(DoubleValueRenderer(params));

    expect(screen.getByTestId('double-value-container')).toHaveAttribute(
      'data-variation-direction2',
      'down',
    );
  });

  describe('data-testid Rendering', () => {
    it('should render container with data-testid when provided', () => {
      const params = createParams('100', {
        value2: '50',
        unitMeasure: '%',
        unitMeasure2: 'pp',
        variationDirection2: 'up',
      });

      const { container } = render(DoubleValueRenderer(params, 'custom'));

      expect(
        container.querySelector(
          '[data-testid="custom-double-value-container"]',
        ),
      ).toBeInTheDocument();
    });

    it('should pass dataTestId to DoubleValueContainer when provided', () => {
      const params = createParams('100', {
        value2: '50',
        unitMeasure: '%',
        unitMeasure2: 'pp',
        variationDirection2: 'up',
      });

      render(DoubleValueRenderer(params, 'custom'));

      // Verifica que o DoubleValueContainer recebeu o dataTestId
      // através do elemento que contém o texto "DoubleValueContainer"
      const doubleValueContainer = screen
        .getByText('DoubleValueContainer')
        .closest('[data-testid]');

      expect(doubleValueContainer).toBeInTheDocument();
      expect(doubleValueContainer).toHaveAttribute(
        'data-testid',
        'custom-double-value-container',
      );
    });

    it('should not render data-testid when not provided', () => {
      const params = createParams('100', {
        value2: '50',
        unitMeasure: '%',
        unitMeasure2: 'pp',
        variationDirection2: 'up',
      });

      const { container } = render(DoubleValueRenderer(params));

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      const params = createParams('100', {
        value2: '50',
        unitMeasure: '%',
        unitMeasure2: 'pp',
        variationDirection2: 'up',
      });

      render(DoubleValueRenderer(params));

      expect(screen.getByTestId('double-value-container')).toBeInTheDocument();
    });
  });
});

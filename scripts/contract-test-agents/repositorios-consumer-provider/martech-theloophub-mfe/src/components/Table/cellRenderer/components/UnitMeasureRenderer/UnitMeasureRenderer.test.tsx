import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { UnitMeasureRenderer } from './UnitMeasureRenderer';

describe('UnitMeasureRenderer', () => {
  it('should render the component', () => {
    const { container } = render(
      <UnitMeasureRenderer value="100" unitMeasure="%" />,
    );

    expect(container.textContent).toBe('100%');
  });

  it('should render value and unitMeasure together', () => {
    const { container } = render(
      <UnitMeasureRenderer value="75" unitMeasure="kg" />,
    );

    expect(container.textContent).toBe('75kg');
  });

  it('should render with empty unitMeasure', () => {
    const { container } = render(
      <UnitMeasureRenderer value="50" unitMeasure="" />,
    );

    expect(container.textContent).toBe('50');
  });

  it('should render with empty value', () => {
    const { container } = render(
      <UnitMeasureRenderer value="" unitMeasure="km" />,
    );

    expect(container.textContent).toBe('km');
  });

  it('should render with different unit measures', () => {
    const { container } = render(
      <UnitMeasureRenderer value="10" unitMeasure="USD" />,
    );

    expect(container.textContent).toBe('10USD');
  });
});

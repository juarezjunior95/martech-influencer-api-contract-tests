import React from 'react';

import { render, screen } from '@testing-library/react';

import { tooltipValueGetter } from './tooltipValueGetter';

describe('tooltipValueGetter', () => {
  const createParams = (fieldValue: string) =>
    ({
      colDef: { field: 'portfolio' },
      data: { portfolio: fieldValue },
    }) as any;

  it('should return megabrands tooltip for megabrands value', () => {
    const params = createParams('Megabrands');

    const result = tooltipValueGetter(params);

    render(<>{result}</>);
    expect(
      screen.getByText('Exhibit both scale and growth.'),
    ).toBeInTheDocument();
  });

  it('should return expansion tooltip for expansion value', () => {
    const params = createParams('Expansion');

    const result = tooltipValueGetter(params);

    render(<>{result}</>);
    expect(
      screen.getByText('Exhibit growth but no scale.'),
    ).toBeInTheDocument();
  });

  it('should return sustain tooltip for sustain value', () => {
    const params = createParams('Sustain');

    const result = tooltipValueGetter(params);

    render(<>{result}</>);
    expect(
      screen.getByText('Exhibit scale but low growth.'),
    ).toBeInTheDocument();
  });

  it('should return tail tooltip for tail value', () => {
    const params = createParams('Tail');

    const result = tooltipValueGetter(params);

    render(<>{result}</>);
    expect(
      screen.getByText('Exhibit neither scale nor growth.'),
    ).toBeInTheDocument();
  });

  it('should return empty string for unknown value', () => {
    const params = createParams('unknown');

    const result = tooltipValueGetter(params);

    expect(result).toBe('');
  });

  it('should handle lowercase values', () => {
    const params = createParams('megabrands');

    const result = tooltipValueGetter(params);

    render(<>{result}</>);
    expect(
      screen.getByText('Exhibit both scale and growth.'),
    ).toBeInTheDocument();
  });
});

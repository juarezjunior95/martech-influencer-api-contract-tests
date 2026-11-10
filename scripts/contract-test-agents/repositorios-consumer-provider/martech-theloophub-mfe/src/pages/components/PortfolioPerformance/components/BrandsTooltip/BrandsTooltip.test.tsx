import React from 'react';

import { render, screen } from '@testing-library/react';

import { BrandsTooltip } from './BrandsTooltip';

describe('BrandsTooltip', () => {
  it('should render the component', () => {
    render(<BrandsTooltip />);

    expect(
      screen.getByText(/This section presents our top brands ranked by volume/),
    ).toBeInTheDocument();
  });

  it('should render with data-testid', () => {
    render(<BrandsTooltip dataTestId="tooltip-test" />);

    expect(screen.getByTestId('tooltip-test')).toBeInTheDocument();
  });
});

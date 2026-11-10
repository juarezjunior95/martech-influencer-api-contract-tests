import { render, screen } from '@testing-library/react';

import { DataTableHeaderTooltipContent } from './DataTableHeaderTooltipContent';

describe('DataTableHeaderTooltipContent', () => {
  it('renders title and description without bullet when no indicatorColor', () => {
    const { container } = render(
      <DataTableHeaderTooltipContent title="Metric" description="Body copy." />,
    );
    expect(screen.getByText('Metric')).toBeInTheDocument();
    expect(screen.getByText('Body copy.')).toBeInTheDocument();
    expect(
      container.querySelector('[aria-hidden="true"]'),
    ).not.toBeInTheDocument();
  });

  it('renders bullet when indicatorColor is set', () => {
    const { container } = render(
      <DataTableHeaderTooltipContent
        title="Volume"
        description="Share of volume."
        indicatorColor="#FF0000"
      />,
    );
    const bullet = container.querySelector('[aria-hidden="true"]');
    expect(bullet).toBeInTheDocument();
    expect(bullet).toHaveStyle({ background: '#FF0000' });
  });
});

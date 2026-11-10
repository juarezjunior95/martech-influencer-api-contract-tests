import { fireEvent, render, screen } from '@testing-library/react';

import { CaptionItem, Legend } from './Legend';

const LegendMock: CaptionItem[] = [
  {
    label: '2019',
    color: '#ABBFCB',
    fontWeight: 'medium',
    captionType: 'bar',
    pointStyle: 'square',
  },
  {
    color: '#D1A33C',
    label: '2020',
    fontWeight: 'medium',
    captionType: 'bar',
    pointStyle: 'square',
  },
];

describe('Legend Component', () => {
  it('renders all items in the caption prop', () => {
    render(<Legend caption={LegendMock} />);

    LegendMock.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('renders nothing when caption is empty', () => {
    render(<Legend caption={[]} />);

    expect(screen.queryByText(/Item/)).not.toBeInTheDocument();
  });

  it('renders triangle pointStyle item', () => {
    render(
      <Legend
        dataTestId="legend"
        caption={[
          { label: 'Expansion', color: '#C2346A', pointStyle: 'triangle' },
        ]}
      />,
    );

    expect(screen.getByText('Expansion')).toBeInTheDocument();
    expect(screen.getByTestId('legend-item-0-indicator')).toBeInTheDocument();
  });

  it('applies reduced opacity when an item is disabled', () => {
    render(
      <Legend
        dataTestId="legend"
        caption={[{ label: 'Disabled item', color: '#AAA', disabled: true }]}
      />,
    );

    expect(screen.getByTestId('legend-item-0')).toHaveStyle({ opacity: 0.5 });
  });

  it('applies border style to the color indicator when border is provided', () => {
    render(
      <Legend
        dataTestId="legend"
        caption={[{ label: 'Bordered', color: '#AAA', border: '#000000' }]}
      />,
    );

    expect(screen.getByTestId('legend-item-0-indicator')).toHaveStyle({
      border: '1px solid #000000',
    });
  });

  it('sets pointer cursor and calls onItemClick with the clicked item', () => {
    const handleClick = jest.fn();
    render(
      <Legend
        dataTestId="legend"
        caption={[{ label: 'Clickable', color: '#AAA' }]}
        onItemClick={handleClick}
      />,
    );

    const item = screen.getByTestId('legend-item-0');
    expect(item).toHaveStyle({ cursor: 'pointer' });
    fireEvent.click(item);
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Clickable' }),
    );
  });

  it('renders StripedBackground inside the indicator when pattern type is striped', () => {
    render(
      <Legend
        dataTestId="legend"
        caption={[
          {
            label: 'Striped',
            color: '#AAA',
            pattern: {
              type: 'striped',
              flags: [],
              params: { angle: 45, color: '#FFF' },
            },
          },
        ]}
      />,
    );

    expect(
      screen.getByTestId('legend-item-0-indicator').firstChild,
    ).not.toBeNull();
  });
});

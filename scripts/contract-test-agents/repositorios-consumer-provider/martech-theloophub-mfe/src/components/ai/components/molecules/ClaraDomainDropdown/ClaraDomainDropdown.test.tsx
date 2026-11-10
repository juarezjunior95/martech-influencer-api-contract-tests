import { fireEvent, render, screen } from '@testing-library/react';

import { ClaraDomainDropdown } from './ClaraDomainDropdown';
import type { ClaraDomainOption } from './ClaraDomainDropdown';

const options: ClaraDomainOption[] = [
  {
    label: 'Clara: Category',
    value: 'category',
    description:
      'Gain Brand Participation Insights from Atlantia and Kantar surveys',
  },
  {
    label: 'Clara: Brand Guidance',
    value: 'brand-guidance',
    description:
      "Gain global insights from Kantar to better understand your Brand's marketing power.",
  },
];

describe('ClaraDomainDropdown', () => {
  it('should show the selected Clara domain', () => {
    render(
      <ClaraDomainDropdown
        options={options}
        selected={options[1]}
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Select Clara AI insight source' }),
    ).toHaveTextContent('Clara: Brand Guidance');
  });

  it('should render option descriptions when open', () => {
    render(
      <ClaraDomainDropdown
        options={options}
        selected={options[1]}
        onChange={jest.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Select Clara AI insight source' }),
    );

    expect(screen.getByText('Clara: Category')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Gain Brand Participation Insights from Atlantia and Kantar surveys',
      ),
    ).toBeInTheDocument();
  });

  it('should call onChange with selected option and close the menu', () => {
    const onChange = jest.fn();

    render(
      <ClaraDomainDropdown
        options={options}
        selected={options[1]}
        onChange={onChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Select Clara AI insight source' }),
    );
    fireEvent.click(screen.getByRole('option', { name: /Clara: Category/i }));

    expect(onChange).toHaveBeenCalledWith(options[0]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

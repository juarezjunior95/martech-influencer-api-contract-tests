import { render, screen } from '@testing-library/react';

import { BetaTag } from './BetaTag';

describe('BetaTag', () => {
  it('should render the BETA label', () => {
    render(<BetaTag />);

    expect(screen.getByText('BETA')).toBeInTheDocument();
  });

  it('should render the BETA label inside a span element', () => {
    const { container } = render(<BetaTag />);
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('BETA');
  });

  it('should wrap the span inside a styled container', () => {
    const { container } = render(<BetaTag />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toBeInstanceOf(HTMLDivElement);
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.querySelector('span')).toBeInTheDocument();
  });

  it('should render only one BETA label', () => {
    render(<BetaTag />);

    expect(screen.getAllByText('BETA')).toHaveLength(1);
  });
});

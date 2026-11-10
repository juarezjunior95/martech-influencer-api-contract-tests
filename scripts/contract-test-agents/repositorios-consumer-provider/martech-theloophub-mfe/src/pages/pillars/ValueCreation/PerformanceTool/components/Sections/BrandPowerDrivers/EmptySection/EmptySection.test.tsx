import { render, screen } from '@testing-library/react';

import { EmptySection } from './EmptySection';

jest.mock('assets/comming-soon.svg', () => 'mocked-comming-soon-icon.svg');

describe('EmptySection', () => {
  it('should render the title text', () => {
    render(<EmptySection />);

    expect(
      screen.getByText('The Drivers view & data is coming soon!'),
    ).toBeInTheDocument();
  });

  it('should render the illustration with correct src and alt', () => {
    render(<EmptySection />);

    const image = screen.getByAltText('no data yet');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('mocked-comming-soon-icon.svg'),
    );
  });
});

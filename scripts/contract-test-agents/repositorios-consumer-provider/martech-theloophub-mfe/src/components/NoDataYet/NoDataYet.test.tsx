import { render, screen } from '@testing-library/react';

import NoDataYet from './NoDataYet';

describe('NoDataYet Component', () => {
  it('should render the component without crashing', () => {
    render(<NoDataYet />);
    expect(screen.getByText('Data not available')).toBeInTheDocument();
  });

  describe('data-testid Rendering', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<NoDataYet dataTestId="custom" />);
      expect(screen.getByTestId('no-data-yet-custom')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<NoDataYet />);
      const elementsWithTestId = container.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});

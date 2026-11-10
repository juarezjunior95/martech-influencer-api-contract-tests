import { render, screen } from '@testing-library/react';

import { BottomBar } from './BottomBar';

describe('BottomBar', () => {
  const defaultProps = {
    inputValue: '',
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  it('should render the text area', () => {
    render(<BottomBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Ask a question')).toBeInTheDocument();
  });

  it('should render the hint text', () => {
    render(<BottomBar {...defaultProps} />);
    expect(screen.getByText(/I can't see the dashboards/)).toBeInTheDocument();
  });

  it('should render the disclaimer text', () => {
    render(<BottomBar {...defaultProps} />);
    expect(screen.getByText(/Clara can make mistakes/)).toBeInTheDocument();
  });

  it('should display the input value', () => {
    render(<BottomBar {...defaultProps} inputValue="Hello" />);
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument();
  });

  it('should disable textarea when loading', () => {
    render(<BottomBar {...defaultProps} isLoading />);
    expect(screen.getByPlaceholderText('Ask a question')).toBeDisabled();
  });

  it('should render Clara domain dropdown content near input actions', () => {
    render(
      <BottomBar
        {...defaultProps}
        claraDomainDropdown={
          <button type="button">Clara: Brand Guidance</button>
        }
      />,
    );

    expect(screen.getByText('Clara: Brand Guidance')).toBeInTheDocument();
  });
});

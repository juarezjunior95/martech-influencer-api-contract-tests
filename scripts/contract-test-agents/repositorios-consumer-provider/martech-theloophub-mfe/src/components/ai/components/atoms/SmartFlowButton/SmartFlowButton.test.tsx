import { fireEvent, render, screen } from '@testing-library/react';

import { SmartFlowButton } from './SmartFlowButton';

describe('SmartFlowButton', () => {
  it('renders default label', () => {
    render(<SmartFlowButton onClick={jest.fn()} />);
    expect(screen.getByText('Smart Flows')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<SmartFlowButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows active title when active', () => {
    render(
      <SmartFlowButton active activeTitle="Sales Report" onClick={jest.fn()} />,
    );
    expect(screen.getByText('Sales Report')).toBeInTheDocument();
  });

  it('shows close icon when active with onClose', () => {
    render(
      <SmartFlowButton
        active
        activeTitle="Sales"
        onClick={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByLabelText('Smart Flow: Sales')).toBeInTheDocument();
  });

  it('calls onClose without triggering onClick', () => {
    const onClick = jest.fn();
    const onClose = jest.fn();
    const { container } = render(
      <SmartFlowButton
        active
        activeTitle="Sales"
        onClick={onClick}
        onClose={onClose}
      />,
    );
    const closeIcon = container.querySelector('[aria-hidden]');
    fireEvent.click(closeIcon!);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<SmartFlowButton onClick={jest.fn()} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

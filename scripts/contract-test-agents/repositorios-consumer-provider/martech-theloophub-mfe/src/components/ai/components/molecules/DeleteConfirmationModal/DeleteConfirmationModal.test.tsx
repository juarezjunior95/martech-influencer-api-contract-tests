import { fireEvent, render, screen } from '@testing-library/react';

import { DeleteConfirmationModal } from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  const defaultProps = {
    open: true,
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should render title and description when open', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    expect(screen.getByText('Delete chat?')).toBeInTheDocument();
    expect(
      screen.getByText('This action cannot be undone.'),
    ).toBeInTheDocument();
  });

  it('should not render content when closed', () => {
    render(<DeleteConfirmationModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Delete chat?')).not.toBeInTheDocument();
  });

  it('should call onConfirm when Delete is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when Cancel is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});

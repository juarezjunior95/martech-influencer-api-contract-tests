import { fireEvent, render, screen } from '@testing-library/react';

import { ArtifactModal } from './ArtifactModal';

describe('ArtifactModal', () => {
  const mockOnLoadBlob = jest.fn();
  const defaultProps = {
    title: 'Artifact',
    open: true,
    onClose: jest.fn(),
    blobPath: 'test-blob-path',
    blobContent: null as string | null,
    blobLoading: false,
    blobError: false,
    onLoadBlob: mockOnLoadBlob,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render content when open', () => {
    render(<ArtifactModal {...defaultProps} />);
    expect(screen.getByText('Artifact')).toBeInTheDocument();
  });

  it('should not render content when closed', () => {
    render(<ArtifactModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Artifact')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<ArtifactModal {...defaultProps} />);
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onLoadBlob when open with blobPath', () => {
    render(<ArtifactModal {...defaultProps} />);
    expect(mockOnLoadBlob).toHaveBeenCalledWith('test-blob-path');
  });

  it('should show loading state', () => {
    render(<ArtifactModal {...defaultProps} blobLoading />);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  it('should display error message when blobError is true', () => {
    render(<ArtifactModal {...defaultProps} blobError />);
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('should not call onLoadBlob when blobPath is not provided', () => {
    render(<ArtifactModal {...defaultProps} blobPath={undefined} />);
    expect(mockOnLoadBlob).not.toHaveBeenCalled();
  });

  it('should render markdown content when loaded', () => {
    render(<ArtifactModal {...defaultProps} blobContent="# Test Content" />);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  it('should render copy button when not loading', () => {
    render(<ArtifactModal {...defaultProps} />);
    expect(screen.getByLabelText('Copy')).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';

import { ArtifactCard } from './ArtifactCard';

const artifact = {
  question: 'Sales Report Q1',
  url: 'https://example.com/report',
};

describe('ArtifactCard', () => {
  it('renders artifact question', () => {
    render(<ArtifactCard artifact={artifact} />);
    expect(screen.getByText('Sales Report Q1')).toBeInTheDocument();
  });

  it('renders arrow icon', () => {
    render(<ArtifactCard artifact={artifact} />);
    expect(screen.getByText('↗')).toBeInTheDocument();
  });

  it('links to artifact url when no onClick is provided', () => {
    render(<ArtifactCard artifact={artifact} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/report');
  });

  it('opens in new tab', () => {
    render(<ArtifactCard artifact={artifact} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onClick when provided instead of linking', () => {
    const onClick = jest.fn();
    render(<ArtifactCard artifact={artifact} onClick={onClick} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Sales Report Q1'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as div when onClick is provided', () => {
    const onClick = jest.fn();
    render(<ArtifactCard artifact={artifact} onClick={onClick} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Sales Report Q1')).toBeInTheDocument();
  });
});

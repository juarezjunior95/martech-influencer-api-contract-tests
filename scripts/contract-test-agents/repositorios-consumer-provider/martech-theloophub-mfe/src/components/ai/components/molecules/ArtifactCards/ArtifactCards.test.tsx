import { fireEvent, render, screen } from '@testing-library/react';

import type { Artifact } from '../../../types';
import { ArtifactCards } from './ArtifactCards';

describe('ArtifactCards', () => {
  const mockArtifacts: Artifact[] = [
    {
      question: 'Document 1',
      url: 'https://example.com/doc1',
    },
    {
      question: 'Document 2',
      url: 'https://example.com/doc2',
    },
  ];

  it('should render documents label', () => {
    render(<ArtifactCards artifacts={mockArtifacts} />);
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  it('should render all artifacts', () => {
    render(<ArtifactCards artifacts={mockArtifacts} />);
    expect(screen.getByText('Document 1')).toBeInTheDocument();
    expect(screen.getByText('Document 2')).toBeInTheDocument();
  });

  it('should call onArtifactClick when artifact is clicked', () => {
    const onArtifactClick = jest.fn();
    render(
      <ArtifactCards
        artifacts={mockArtifacts}
        onArtifactClick={onArtifactClick}
      />,
    );

    fireEvent.click(screen.getByText('Document 1'));
    expect(onArtifactClick).toHaveBeenCalledWith(mockArtifacts[0]);
  });

  it('should render empty container when no artifacts', () => {
    render(<ArtifactCards artifacts={[]} />);
    expect(screen.getByTestId('artifact-cards')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });
});

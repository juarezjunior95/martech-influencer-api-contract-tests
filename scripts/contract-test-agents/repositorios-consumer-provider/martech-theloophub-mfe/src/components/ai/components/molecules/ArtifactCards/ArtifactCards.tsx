import type { Artifact } from '../../../types';
import { ArtifactCard } from '../../atoms/ArtifactCard';
import { Container, Label } from './ArtifactCards.styles';

interface ArtifactCardsProps {
  artifacts: Artifact[];
  onArtifactClick?: (artifact: Artifact) => void;
}

export const ArtifactCards = ({
  artifacts,
  onArtifactClick,
}: ArtifactCardsProps) => (
  <Container data-testid="artifact-cards">
    <Label>Documents</Label>
    {artifacts.map((artifact, index) => (
      <ArtifactCard
        key={`${artifact.url}-${index}`}
        artifact={artifact}
        onClick={() => onArtifactClick?.(artifact)}
      />
    ))}
  </Container>
);

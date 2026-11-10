import {
  Avatar,
  Bar,
  Block,
  Container,
  HeaderRow,
  Lines,
} from './SkeletonLoader.styles';

export interface SkeletonLoaderProps {
  count?: number;
  size?: 'sm' | 'md';
  showAvatar?: boolean;
}

export function SkeletonLoader({
  count = 3,
  size = 'md',
  showAvatar = true,
}: Readonly<SkeletonLoaderProps>) {
  return (
    <Container data-testid="skeleton-loader" role="status" aria-label="Loading">
      {Array.from(
        { length: count },
        (_, index) => `skeleton-${size}-${index}`,
      ).map((id) => (
        <Block key={id}>
          <HeaderRow>
            {showAvatar && <Avatar />}
            <Bar width="short" size={size} />
          </HeaderRow>
          <Lines>
            <Bar width="full" size={size} />
            <Bar width="full" size={size} />
          </Lines>
        </Block>
      ))}
    </Container>
  );
}

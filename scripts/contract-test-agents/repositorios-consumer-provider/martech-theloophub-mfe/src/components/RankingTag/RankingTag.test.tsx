import { render, screen } from '@testing-library/react';

import { RankingTag } from './RankingTag';

describe('RankingTag Component', () => {
  it('should render position 1 with type "medal"', () => {
    render(<RankingTag position={1} type="medal" />);

    const numberPosition = screen.getByText('1');
    expect(numberPosition).toBeInTheDocument();
  });

  it('should render position 2 with type "medal"', () => {
    render(<RankingTag position={2} type="medal" />);

    const numberPosition = screen.getByText('2');
    expect(numberPosition).toBeInTheDocument();
  });

  it('should render position 3 with type "medal"', () => {
    render(<RankingTag position={3} type="medal" />);

    const numberPosition = screen.getByText('3');
    expect(numberPosition).toBeInTheDocument();
  });

  describe('data-testid Rendering', () => {
    it('should render all elements with data-testid when dataTestId is provided for position 1', () => {
      render(<RankingTag position={1} type="medal" dataTestId="custom" />);

      expect(
        screen.getByTestId('ranking-tag-medal-1-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ranking-tag-medal-1-image-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ranking-tag-medal-1-position-custom'),
      ).toBeInTheDocument();
    });

    it('should render all elements with data-testid when dataTestId is provided for position 2', () => {
      render(<RankingTag position={2} type="medal" dataTestId="custom" />);

      expect(
        screen.getByTestId('ranking-tag-medal-2-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ranking-tag-medal-2-image-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ranking-tag-medal-2-position-custom'),
      ).toBeInTheDocument();
    });

    it('should render all elements with data-testid when dataTestId is provided for position 3', () => {
      render(<RankingTag position={3} type="medal" dataTestId="custom" />);

      expect(
        screen.getByTestId('ranking-tag-medal-3-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ranking-tag-medal-3-image-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('ranking-tag-medal-3-position-custom'),
      ).toBeInTheDocument();
    });

    it('should render with data-testid when dataTestId is provided for position without medal', () => {
      render(<RankingTag position={4} type="medal" dataTestId="custom" />);

      expect(screen.getByTestId('ranking-tag-rank-custom')).toBeInTheDocument();
    });

    it('should render with data-testid when dataTestId is provided for type ranking', () => {
      render(<RankingTag position={1} type="ranking" dataTestId="custom" />);

      expect(screen.getByTestId('ranking-tag-rank-custom')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<RankingTag position={1} type="medal" />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="ranking-tag-"]',
      );
      expect(elementsWithTestId.length).toBe(0);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <RankingTag position={1} type="medal" dataTestId={undefined} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="ranking-tag-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
});

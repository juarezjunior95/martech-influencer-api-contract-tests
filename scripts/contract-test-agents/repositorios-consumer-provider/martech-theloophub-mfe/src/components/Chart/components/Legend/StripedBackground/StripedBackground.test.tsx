import { render, screen } from '@testing-library/react';

import { StripedBackground } from './StripedBackground';

jest.mock('./StripedBackground.styles', () => ({
  StyledStripedBackground: ({ style }: { style: React.CSSProperties }) => (
    <div
      data-testid="striped-background"
      data-background={String(style?.background ?? '')}
      style={{ border: String(style?.border ?? '') }}
    />
  ),
}));

describe('StripedBackground', () => {
  const defaultParams = {
    angle: 45,
    color: '#ff0000',
  };

  describe('Rendering', () => {
    it('should render the striped background with data-testid', () => {
      render(
        <StripedBackground params={defaultParams} backgroundColor="#ffffff" />,
      );

      expect(screen.getByTestId('striped-background')).toBeInTheDocument();
    });

    it('should apply the computed background gradient style', () => {
      render(
        <StripedBackground params={defaultParams} backgroundColor="#ffffff" />,
      );

      const element = screen.getByTestId('striped-background');
      const background = element.dataset.background ?? '';

      expect(background).toContain('repeating-linear-gradient');
      expect(background).toContain('45deg');
      expect(background).toContain('#ff0000');
      expect(background).toContain('#ffffff');
    });

    it('should apply border with backgroundColor', () => {
      render(
        <StripedBackground params={defaultParams} backgroundColor="#cccccc" />,
      );

      const element = screen.getByTestId('striped-background');

      expect(element).toHaveStyle({ border: '1px solid #cccccc' });
    });
  });

  describe('Functionality', () => {
    it('should update gradient when params change', () => {
      const { rerender } = render(
        <StripedBackground
          params={{ angle: 45, color: '#ff0000' }}
          backgroundColor="#ffffff"
        />,
      );

      const element1 = screen.getByTestId('striped-background');
      const bg1 = element1.dataset.background ?? '';

      expect(bg1).toContain('45deg');
      expect(bg1).toContain('#ff0000');

      rerender(
        <StripedBackground
          params={{ angle: 90, color: '#0000ff' }}
          backgroundColor="#ffffff"
        />,
      );

      const element2 = screen.getByTestId('striped-background');
      const bg2 = element2.dataset.background ?? '';

      expect(bg2).toContain('90deg');
      expect(bg2).toContain('#0000ff');
    });

    it('should update gradient when backgroundColor changes', () => {
      const { rerender } = render(
        <StripedBackground params={defaultParams} backgroundColor="#ffffff" />,
      );

      rerender(
        <StripedBackground params={defaultParams} backgroundColor="#000000" />,
      );

      const element = screen.getByTestId('striped-background');
      const bg = element.dataset.background ?? '';

      expect(bg).toContain('#000000');
    });

    it('should generate correct gradient with 0 degree angle', () => {
      render(
        <StripedBackground
          params={{ angle: 0, color: '#aabbcc' }}
          backgroundColor="#112233"
        />,
      );

      const element = screen.getByTestId('striped-background');
      const bg = element.dataset.background ?? '';

      expect(bg).toContain('0deg');
      expect(bg).toContain('#aabbcc');
      expect(bg).toContain('#112233');
    });
  });
});

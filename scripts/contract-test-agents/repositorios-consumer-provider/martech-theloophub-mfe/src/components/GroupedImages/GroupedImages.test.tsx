import { render, screen } from '@testing-library/react';
import { GroupedImages } from 'components/GroupedImages';

jest.mock('components/GroupedImages/GroupedImages.styles', () => ({
  StyledGroupedImagesContainer: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  StyledImage: (props: any) => <img alt="" {...props} />,
}));

describe('GroupedImages', () => {
  const mockImages = [
    { src: 'https://example.com/br.png', alt: 'Brazil' },
    { src: 'https://example.com/us.png', alt: 'United States' },
    { src: 'https://example.com/mx.png', alt: 'Mexico' },
  ];

  it('should render all images', () => {
    render(<GroupedImages images={mockImages} dataTestId="test" />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('should set correct src and alt for each image', () => {
    render(<GroupedImages images={mockImages} dataTestId="test" />);

    mockImages.forEach(({ src, alt }) => {
      const img = screen.getByAltText(alt);
      expect(img).toHaveAttribute('src', src);
    });
  });

  it('should apply default size of 24', () => {
    render(<GroupedImages images={mockImages} dataTestId="test" />);

    const img = screen.getByAltText('Brazil');
    expect(img.style.width).toBe('24px');
    expect(img.style.height).toBe('24px');
  });

  it('should apply custom size', () => {
    render(<GroupedImages images={mockImages} size={32} dataTestId="test" />);

    const img = screen.getByAltText('Brazil');
    expect(img.style.width).toBe('32px');
    expect(img.style.height).toBe('32px');
  });

  it('should apply descending zIndex for overlap effect', () => {
    render(<GroupedImages images={mockImages} dataTestId="test" />);

    const images = screen.getAllByRole('img');
    expect(images[0].style.zIndex).toBe('3');
    expect(images[1].style.zIndex).toBe('2');
    expect(images[2].style.zIndex).toBe('1');
  });

  it('should render data-testid on container when dataTestId is provided', () => {
    render(<GroupedImages images={mockImages} dataTestId="flags" />);

    expect(screen.getByTestId('grouped-images-flags')).toBeInTheDocument();
  });

  it('should render data-testid on each image when dataTestId is provided', () => {
    render(<GroupedImages images={mockImages} dataTestId="flags" />);

    mockImages.forEach(({ src }) => {
      expect(
        screen.getByTestId(`grouped-image-${src}-flags`),
      ).toBeInTheDocument();
    });
  });

  it('should not render data-testid when dataTestId is not provided', () => {
    render(<GroupedImages images={mockImages} />);

    expect(screen.queryByTestId('grouped-images-undefined')).toBeNull();
    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img.getAttribute('data-testid')).toBeNull();
    });
  });

  it('should render single image correctly', () => {
    const singleImage = [{ src: 'https://example.com/br.png', alt: 'Brazil' }];
    render(<GroupedImages images={singleImage} dataTestId="single" />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
    expect(images[0].style.zIndex).toBe('1');
  });

  it('should render empty list without errors', () => {
    render(<GroupedImages images={[]} dataTestId="empty" />);

    expect(screen.getByTestId('grouped-images-empty')).toBeInTheDocument();
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});

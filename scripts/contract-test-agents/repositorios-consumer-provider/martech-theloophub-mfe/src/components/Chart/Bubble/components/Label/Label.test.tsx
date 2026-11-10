import { cleanup, render, screen } from '@testing-library/react';

import { Label } from './Label';
import { LabelItem } from './types';

// Mock the styled components
jest.mock('./Label.styles', () => ({
  LabelGrid: ({ children, style }: any) => (
    <div data-testid="label-grid" style={style}>
      {children}
    </div>
  ),
  LabelItemBox: ({ children, style }: any) => (
    <div data-testid="label-item-box" style={style}>
      {children}
    </div>
  ),
  LabelTextAndIconBox: ({ children }: any) => (
    <div data-testid="label-text-icon-box">{children}</div>
  ),
  LabelText: ({ children }: any) => (
    <span data-testid="label-text">{children}</span>
  ),
  LabelImageBox: ({ children }: any) => (
    <div data-testid="label-image-box">{children}</div>
  ),
  LabelImage: ({ src, alt }: any) => (
    <img data-testid="label-image" src={src} alt={alt} />
  ),
}));

describe('Label Component (Bubble)', () => {
  const mockLabels: LabelItem[] = [
    {
      text: 'Brand A',
      icon: '<svg>Icon A</svg>',
      image: 'https://example.com/brand-a.png',
      portfolioColor: '#FF0000',
    },
    {
      text: 'Brand B',
      icon: '<svg>Icon B</svg>',
      portfolioColor: '#00FF00',
    },
    {
      text: 'Brand C',
      icon: '<svg>Icon C</svg>',
      image: '',
    },
  ];

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Label labels={[]} />);
    expect(screen.getByTestId('label-grid')).toBeInTheDocument();
  });

  it('renders all label items', () => {
    render(<Label labels={mockLabels} />);

    expect(screen.getByText('Brand A')).toBeInTheDocument();
    expect(screen.getByText('Brand B')).toBeInTheDocument();
    expect(screen.getByText('Brand C')).toBeInTheDocument();
  });

  it('renders correct number of label boxes', () => {
    render(<Label labels={mockLabels} />);

    const labelBoxes = screen.getAllByTestId('label-item-box');
    expect(labelBoxes).toHaveLength(3);
  });

  it('applies correct grid template columns based on labels length', () => {
    render(<Label labels={mockLabels} />);

    const grid = screen.getByTestId('label-grid');
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(3, 1fr)',
    });
  });

  it('renders icons using dangerouslySetInnerHTML', () => {
    const { container } = render(<Label labels={mockLabels} />);

    const iconContainers = container.querySelectorAll(
      '[data-testid="label-text-icon-box"] > div',
    );
    expect(iconContainers.length).toBeGreaterThan(0);
  });

  it('applies portfolio color as border color', () => {
    render(<Label labels={mockLabels} />);

    const labelBoxes = screen.getAllByTestId('label-item-box');
    expect(labelBoxes[0]).toHaveStyle({ borderColor: '#FF0000' });
    expect(labelBoxes[1]).toHaveStyle({ borderColor: '#00FF00' });
  });

  it('applies transparent border when portfolio color is not provided', () => {
    const labelsWithoutColor: LabelItem[] = [
      {
        text: 'No Color',
        icon: '<svg>Icon</svg>',
      },
    ];

    render(<Label labels={labelsWithoutColor} />);

    const labelBox = screen.getByTestId('label-item-box');
    expect(labelBox).toHaveStyle({ borderColor: 'transparent' });
  });

  it('renders image when provided and not empty', () => {
    render(<Label labels={mockLabels} />);

    const images = screen.getAllByTestId('label-image');
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute('src', 'https://example.com/brand-a.png');
    expect(images[0]).toHaveAttribute('alt', 'Label');
  });

  it('does not render image when image is empty string', () => {
    const labelsWithEmptyImage: LabelItem[] = [
      {
        text: 'Brand',
        icon: '<svg>Icon</svg>',
        image: '',
      },
    ];

    render(<Label labels={labelsWithEmptyImage} />);

    const imageBoxes = screen.queryAllByTestId('label-image-box');
    expect(imageBoxes).toHaveLength(0);
  });

  it('does not render image when image is whitespace only', () => {
    const labelsWithWhitespaceImage: LabelItem[] = [
      {
        text: 'Brand',
        icon: '<svg>Icon</svg>',
        image: '   ',
      },
    ];

    render(<Label labels={labelsWithWhitespaceImage} />);

    const imageBoxes = screen.queryAllByTestId('label-image-box');
    expect(imageBoxes).toHaveLength(0);
  });

  it('does not render image when image is not provided', () => {
    const labelsWithoutImage: LabelItem[] = [
      {
        text: 'Brand',
        icon: '<svg>Icon</svg>',
      },
    ];

    render(<Label labels={labelsWithoutImage} />);

    const imageBoxes = screen.queryAllByTestId('label-image-box');
    expect(imageBoxes).toHaveLength(0);
  });

  it('handles empty labels array', () => {
    render(<Label labels={[]} />);

    const labelBoxes = screen.queryAllByTestId('label-item-box');
    expect(labelBoxes).toHaveLength(0);

    const grid = screen.getByTestId('label-grid');
    expect(grid).toHaveStyle({
      gridTemplateColumns: 'repeat(0, 1fr)',
    });
  });

  it('renders label with only text', () => {
    const minimalLabel: LabelItem[] = [
      {
        text: 'Minimal',
      },
    ];

    render(<Label labels={minimalLabel} />);

    expect(screen.getByText('Minimal')).toBeInTheDocument();
  });

  it('renders all text and icon boxes', () => {
    render(<Label labels={mockLabels} />);

    const textIconBoxes = screen.getAllByTestId('label-text-icon-box');
    expect(textIconBoxes).toHaveLength(3);
  });
});

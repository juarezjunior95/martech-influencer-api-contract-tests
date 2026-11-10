import { render, screen } from '@testing-library/react';

import { BrandAvatarItemProps } from '../BrandAvatarItem/interface';
import { BrandAvatarList } from './BrandAvatarList';
import { BrandAvatarListProps } from './interface';

jest.mock('../BrandAvatarItem', () => ({
  BrandAvatarItem: ({
    title,
    description,
    dataTestId,
  }: BrandAvatarItemProps) => (
    <div data-testid={dataTestId || 'brand-avatar-item'}>
      <div data-testid="brand-title">{title}</div>
      {description && <div data-testid="brand-description">{description}</div>}
    </div>
  ),
}));

jest.mock('./BrandAvatarList.tsx.styles', () => ({
  StyledBrandListContainer: ({
    children,
    style,
    'data-testid': dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'brand-list-container'} style={style}>
      {children}
    </div>
  ),
}));

describe('BrandAvatarList Component', () => {
  const mockData: BrandAvatarItemProps[] = [
    {
      title: 'Brand 1',
      description: 'Description 1',
      mainBrand: { src: 'brand1.png', alt: 'Brand 1' },
    },
    {
      title: 'Brand 2',
      description: 'Description 2',
      mainBrand: { src: 'brand2.png', alt: 'Brand 2' },
    },
    {
      title: 'Brand 3',
      mainBrand: { src: 'brand3.png', alt: 'Brand 3' },
    },
  ];

  const defaultProps: BrandAvatarListProps = {
    data: mockData,
    length: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with required props', () => {
    render(<BrandAvatarList {...defaultProps} />);

    expect(screen.getByTestId('brand-list-container')).toBeInTheDocument();
  });

  it('should render all items from data array', () => {
    render(<BrandAvatarList {...defaultProps} />);

    const items = screen.getAllByTestId('brand-avatar-item');
    expect(items).toHaveLength(3);
  });

  it('should render items with correct titles', () => {
    render(<BrandAvatarList {...defaultProps} />);

    expect(screen.getByText('Brand 1')).toBeInTheDocument();
    expect(screen.getByText('Brand 2')).toBeInTheDocument();
    expect(screen.getByText('Brand 3')).toBeInTheDocument();
  });

  it('should render items with descriptions when provided', () => {
    render(<BrandAvatarList {...defaultProps} />);

    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should apply correct grid template columns based on length prop', () => {
    render(<BrandAvatarList {...defaultProps} />);

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    });
  });

  it('should apply default border config when not provided', () => {
    render(<BrandAvatarList {...defaultProps} />);

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      marginLeft: 0,
      marginRight: 0,
    });
  });

  it('should apply default grid config when not provided', () => {
    render(<BrandAvatarList {...defaultProps} />);

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      paddingLeft: 8,
      paddingRight: 8,
    });
  });

  it('should merge custom border config with defaults', () => {
    const customBorderConfig = {
      marginLeft: 10,
      marginRight: 20,
    };

    render(
      <BrandAvatarList {...defaultProps} borderConfig={customBorderConfig} />,
    );

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      marginLeft: 10,
      marginRight: 20,
    });
  });

  it('should merge custom grid config with defaults', () => {
    const customGridConfig = {
      paddingLeft: 16,
      paddingRight: 24,
    };

    render(<BrandAvatarList {...defaultProps} gridConfig={customGridConfig} />);

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      paddingLeft: 16,
      paddingRight: 24,
    });
  });

  it('should apply partial border config and keep defaults for missing values', () => {
    const partialBorderConfig = {
      marginLeft: 15,
    };

    render(
      <BrandAvatarList {...defaultProps} borderConfig={partialBorderConfig} />,
    );

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      marginLeft: 15,
      marginRight: 0, // default value
    });
  });

  it('should apply partial grid config and keep defaults for missing values', () => {
    const partialGridConfig = {
      paddingRight: 32,
    };

    render(
      <BrandAvatarList {...defaultProps} gridConfig={partialGridConfig} />,
    );

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      paddingLeft: 8, // default value
      paddingRight: 32,
    });
  });

  it('should render empty list when data array is empty', () => {
    render(<BrandAvatarList data={[]} length={0} />);

    const container = screen.getByTestId('brand-list-container');
    expect(container).toBeInTheDocument();
    expect(screen.queryAllByTestId('brand-avatar-item')).toHaveLength(0);
  });

  it('should render with single item', () => {
    const singleItemData: BrandAvatarItemProps[] = [
      {
        title: 'Single Brand',
        mainBrand: { src: 'single.png', alt: 'Single Brand' },
      },
    ];

    render(<BrandAvatarList data={singleItemData} length={1} />);

    expect(screen.getAllByTestId('brand-avatar-item')).toHaveLength(1);
    expect(screen.getByText('Single Brand')).toBeInTheDocument();
  });

  it('should apply different grid template columns for different lengths', () => {
    const { rerender } = render(
      <BrandAvatarList {...defaultProps} length={3} />,
    );

    let container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    });

    rerender(<BrandAvatarList {...defaultProps} length={5} />);

    container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    });
  });

  it('should render items with unique keys', () => {
    const dataWithDuplicateTitles: BrandAvatarItemProps[] = [
      { title: 'Brand A', mainBrand: { src: 'a1.png', alt: 'A1' } },
      { title: 'Brand A', mainBrand: { src: 'a2.png', alt: 'A2' } },
    ];

    render(<BrandAvatarList data={dataWithDuplicateTitles} length={2} />);

    const items = screen.getAllByTestId('brand-avatar-item');
    expect(items).toHaveLength(2);
  });

  it('should apply all custom configs together', () => {
    const customBorderConfig = {
      marginLeft: 12,
      marginRight: 18,
    };

    const customGridConfig = {
      paddingLeft: 20,
      paddingRight: 28,
    };

    render(
      <BrandAvatarList
        {...defaultProps}
        borderConfig={customBorderConfig}
        gridConfig={customGridConfig}
      />,
    );

    const container = screen.getByTestId('brand-list-container');
    expect(container).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      marginLeft: 12,
      marginRight: 18,
      paddingLeft: 20,
      paddingRight: 28,
    });
  });

  it('should pass all props correctly to BrandAvatarItem', () => {
    const itemWithAllProps: BrandAvatarItemProps[] = [
      {
        title: 'Complete Brand',
        description: 'Complete Description',
        mainBrand: { src: 'complete.png', alt: 'Complete' },
        badgeFlag: { src: 'flag.png', alt: 'Flag' },
      },
    ];

    render(<BrandAvatarList data={itemWithAllProps} length={1} />);

    expect(screen.getByText('Complete Brand')).toBeInTheDocument();
    expect(screen.getByText('Complete Description')).toBeInTheDocument();
  });

  describe('data-testid Rendering', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<BrandAvatarList {...defaultProps} dataTestId="custom" />);

      expect(
        screen.getByTestId('brand-avatar-list-custom'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<BrandAvatarList {...defaultProps} />);
      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="brand-avatar-list"]',
      );
      expect(elementsWithTestId.length).toBe(0);
    });

    it('should pass dataTestId to each BrandAvatarItem with correct format', () => {
      render(<BrandAvatarList {...defaultProps} dataTestId="custom" />);

      expect(screen.getByTestId('custom-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('custom-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('custom-item-2')).toBeInTheDocument();
    });

    it('should render items with correct data-testid indices', () => {
      const singleItemData: BrandAvatarItemProps[] = [
        {
          title: 'Single Brand',
          mainBrand: { src: 'single.png', alt: 'Single Brand' },
        },
      ];

      render(
        <BrandAvatarList data={singleItemData} length={1} dataTestId="test" />,
      );

      expect(screen.getByTestId('brand-avatar-list-test')).toBeInTheDocument();
      expect(screen.getByTestId('test-item-0')).toBeInTheDocument();
    });
  });
});

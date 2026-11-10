import React from 'react';

import { render, screen } from '@testing-library/react';

import { BrandAvatarItem } from './BrandAvatarItem';
import { BrandAvatarItemProps } from './interface';

jest.mock('@hexa-ui/components', () => ({
  Image: jest.fn(({ src, alt }) => (
    <img src={src} alt={alt} data-testid="hexa-image" />
  )),
}));

jest.mock('components/TextDynamicTruncation', () => ({
  TextDynamicTruncation: ({ children, Component, dataTestId }: any) => {
    const ComponentToRender = Component || 'div';
    return (
      <ComponentToRender data-testid={dataTestId}>{children}</ComponentToRender>
    );
  },
}));

jest.mock('./styles', () => ({
  StyledBrandAvatarContainer: ({
    children,
    'data-testid': dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'brand-avatar-container'}>{children}</div>
  ),
  StyledAvatarWrapper: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'avatar-wrapper'}>{children}</div>
  ),
  StyledBrandAvatar: ({ image, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'brand-avatar'} data-image={image}>
      Avatar
    </div>
  ),
  StyledFlagBadge: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'flag-badge'}>{children}</div>
  ),
  StyledTitleContainer: ({ children, ref, 'data-testid': dataTestId }: any) => (
    <div ref={ref} data-testid={dataTestId || 'title-container'}>
      {children}
    </div>
  ),
  StyledTitle: ({ children }: any) => <div data-testid="title">{children}</div>,
  StyledSubtitle: ({ children }: any) => (
    <div data-testid="subtitle">{children}</div>
  ),
}));

describe('BrandAvatarItem Component', () => {
  const mockMainBrand = {
    src: 'https://example.com/brand.png',
    alt: 'Brand Logo',
  };

  const mockBadgeFlag = {
    src: 'https://example.com/flag.png',
    alt: 'Country Flag',
  };

  const defaultProps: BrandAvatarItemProps = {
    title: 'Brand Name',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with only required props (title)', () => {
    render(<BrandAvatarItem {...defaultProps} />);

    expect(screen.getByTestId('brand-avatar-container')).toBeInTheDocument();
    expect(screen.getByTestId('title-container')).toBeInTheDocument();
    expect(screen.getByText('Brand Name')).toBeInTheDocument();
  });

  it('should render without mainBrand when not provided', () => {
    render(<BrandAvatarItem {...defaultProps} />);

    expect(screen.queryByTestId('avatar-wrapper')).not.toBeInTheDocument();
    expect(screen.queryByTestId('brand-avatar')).not.toBeInTheDocument();
  });

  it('should render with mainBrand when provided', () => {
    render(<BrandAvatarItem {...defaultProps} mainBrand={mockMainBrand} />);

    expect(screen.getByTestId('avatar-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('brand-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('brand-avatar')).toHaveAttribute(
      'data-image',
      mockMainBrand.src,
    );
  });

  it('should render badgeFlag when both mainBrand and badgeFlag are provided', () => {
    render(
      <BrandAvatarItem
        {...defaultProps}
        mainBrand={mockMainBrand}
        badgeFlag={mockBadgeFlag}
      />,
    );

    expect(screen.getByTestId('flag-badge')).toBeInTheDocument();
    expect(screen.getByTestId('hexa-image')).toBeInTheDocument();
    expect(screen.getByTestId('hexa-image')).toHaveAttribute(
      'src',
      mockBadgeFlag.src,
    );
    expect(screen.getByTestId('hexa-image')).toHaveAttribute(
      'alt',
      mockBadgeFlag.alt,
    );
  });

  it('should not render badgeFlag when mainBrand is not provided', () => {
    render(<BrandAvatarItem {...defaultProps} badgeFlag={mockBadgeFlag} />);

    expect(screen.queryByTestId('flag-badge')).not.toBeInTheDocument();
  });

  it('should not render badgeFlag when badgeFlag is not provided', () => {
    render(<BrandAvatarItem {...defaultProps} mainBrand={mockMainBrand} />);

    expect(screen.queryByTestId('flag-badge')).not.toBeInTheDocument();
  });

  it('should render description when provided', () => {
    const description = 'Brand Description';
    render(<BrandAvatarItem {...defaultProps} description={description} />);

    expect(screen.getByTestId('subtitle')).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(<BrandAvatarItem {...defaultProps} />);

    expect(screen.queryByTestId('subtitle')).not.toBeInTheDocument();
  });

  it('should render all elements with data-testid when dataTestId is provided', () => {
    render(
      <BrandAvatarItem
        {...defaultProps}
        mainBrand={mockMainBrand}
        badgeFlag={mockBadgeFlag}
        description="Description"
        dataTestId="custom"
      />,
    );
    expect(screen.getByTestId('brand-avatar-item-custom')).toBeInTheDocument();
    expect(
      screen.getByTestId('brand-avatar-item-wrapper-custom'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('brand-avatar-item-image-custom'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('brand-avatar-item-badge-custom'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('brand-avatar-item-title-custom'),
    ).toBeInTheDocument();
    expect(screen.getByText('Brand Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should render title in the correct container', () => {
    render(<BrandAvatarItem {...defaultProps} />);

    const titleContainer = screen.getByTestId('title-container');
    const title = screen.getByTestId('title');
    expect(titleContainer).toContainElement(title);
    expect(title).toHaveTextContent('Brand Name');
  });

  it('should render both title and description in the correct container', () => {
    render(
      <BrandAvatarItem {...defaultProps} description="Brand Description" />,
    );

    const titleContainer = screen.getByTestId('title-container');
    const title = screen.getByTestId('title');
    const subtitle = screen.getByTestId('subtitle');

    expect(titleContainer).toContainElement(title);
    expect(titleContainer).toContainElement(subtitle);
    expect(title).toHaveTextContent('Brand Name');
    expect(subtitle).toHaveTextContent('Brand Description');
  });

  describe('data-testid Rendering', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<BrandAvatarItem {...defaultProps} dataTestId="custom" />);

      expect(
        screen.getByTestId('brand-avatar-item-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-avatar-item-title-custom'),
      ).toBeInTheDocument();
      const titleContainer = screen.getByTestId(
        'brand-avatar-item-title-custom',
      );
      expect(titleContainer).toContainElement(screen.getByText('Brand Name'));
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<BrandAvatarItem {...defaultProps} />);
      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="brand-avatar-item"]',
      );
      expect(elementsWithTestId.length).toBe(0);
    });

    it('should render all elements with data-testid when dataTestId is provided', () => {
      render(
        <BrandAvatarItem
          {...defaultProps}
          mainBrand={mockMainBrand}
          badgeFlag={mockBadgeFlag}
          description="Description"
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('brand-avatar-item-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-avatar-item-wrapper-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-avatar-item-image-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-avatar-item-badge-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('brand-avatar-item-title-custom'),
      ).toBeInTheDocument();
      expect(screen.getByText('Brand Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should render child components with correct data-testid format', () => {
      render(
        <BrandAvatarItem
          {...defaultProps}
          description="Description"
          dataTestId="test-id"
        />,
      );

      expect(
        screen.getByTestId('brand-avatar-item-title-test-id'),
      ).toBeInTheDocument();
      expect(screen.getByText('Brand Name')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });
});

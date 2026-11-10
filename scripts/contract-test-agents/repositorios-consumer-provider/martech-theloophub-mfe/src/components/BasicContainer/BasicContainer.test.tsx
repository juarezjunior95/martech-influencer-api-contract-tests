import { render, screen } from '@testing-library/react';

import { BasicContainer } from './BasicContainer';

const MockIcon = () => <span data-testid="mock-icon">Icon</span>;

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, size, 'data-testid': dataTestId }: any) => (
    <span
      data-testid={dataTestId || 'hexa-icon'}
      data-icon={icon}
      data-size={size}
    >
      Icon
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: 'info-icon',
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({
    children,
    content,
    title,
    subtitle,
    text,
    label,
    backgroundStyle,
    dataTestId,
    icon,
    size,
  }: any) => (
    <div
      data-testid={dataTestId || 'custom-tooltip'}
      data-label={label}
      data-background-style={backgroundStyle}
      data-size={size}
      data-tooltip-title={title}
      data-tooltip-subtitle={subtitle}
      data-tooltip-text={text}
    >
      {icon != null && (
        <span
          data-testid="hexa-icon"
          data-size={icon.size}
          data-icon={icon.icon}
        />
      )}
      <span
        data-testid={dataTestId ? `${dataTestId}-content` : 'tooltip-content'}
      >
        {content}
      </span>
      {children}
    </div>
  ),
}));

jest.mock('components/Tag', () => ({
  Tag: ({ text, Icon }: any) => (
    <div data-testid="tag">
      {Icon && <Icon />}
      <span>{text}</span>
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledHeader: ({
    children,
    padding,
    borderRadius,
    'data-testid': dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'styled-header'}
      data-padding={padding}
      data-border-radius={borderRadius}
    >
      {children}
    </div>
  ),
  StyledMeasure: ({ children, size, color, weight }: any) => (
    <span
      data-testid="styled-measure"
      data-size={size}
      data-color={color}
      data-weight={weight}
    >
      {children}
    </span>
  ),
  StyledRefreshLabel: ({ children }: any) => (
    <span data-testid="styled-refresh-label">{children}</span>
  ),
  StyledSubtitle: ({ children }: any) => (
    <span data-testid="styled-subtitle">{children}</span>
  ),
  StyledTitle: ({ children, size, 'data-testid': dataTestId }: any) => (
    <h1 data-testid={dataTestId || 'styled-title'} data-size={size}>
      {children}
    </h1>
  ),
}));

jest.mock('utils/container', () => ({
  ContainerWithScroll: ({
    children,
    background,
    padding,
    'data-testid': dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'container-with-scroll'}
      data-background={background}
      data-padding={padding?.toString()}
    >
      {children}
    </div>
  ),
}));

jest.mock('./BasicContainer.styles', () => ({
  StyledBasicContainer: ({
    children,
    border,
    shadow,
    borderRadius,
    'data-testid': dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'basic-container'}
      data-border={border}
      data-shadow={shadow}
      data-border-radius={borderRadius}
    >
      {children}
    </div>
  ),
  StyledBasicContainerHeaderColumn: ({ children }: any) => (
    <div data-testid="header-column">{children}</div>
  ),
  StyledBasicContainerHeaderContent: ({ children }: any) => (
    <div data-testid="header-content">{children}</div>
  ),
  StyledBasicContainerHeaderRow: ({ children }: any) => (
    <div data-testid="header-row">{children}</div>
  ),
  StyledBasicContainerTags: ({ children }: any) => (
    <div data-testid="container-tags">{children}</div>
  ),
  StyledHeaderline: ({ children }: any) => (
    <div data-testid="headerline">{children}</div>
  ),
}));

describe('BasicContainer Component', () => {
  const defaultHeader = {
    title: 'Test Title',
  };

  const defaultChildren = <div data-testid="test-children">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with required props', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('styled-title')).toHaveTextContent(
        'Test Title',
      );
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('should render children inside ContainerWithScroll', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      const scrollContainer = screen.getByTestId('container-with-scroll');
      expect(scrollContainer).toBeInTheDocument();
      expect(scrollContainer).toContainElement(
        screen.getByTestId('test-children'),
      );
    });
  });

  describe('Header Props', () => {
    it('should render title', () => {
      render(
        <BasicContainer header={{ title: 'My Title' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('styled-title')).toHaveTextContent('My Title');
    });

    it('should render title with custom size', () => {
      render(
        <BasicContainer header={{ title: 'Title', titleSize: 'H3' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      const title = screen.getByTestId('styled-title');
      expect(title).toHaveAttribute('data-size', 'H3');
    });

    it('should render subtitle when provided', () => {
      render(
        <BasicContainer header={{ title: 'Title', subtitle: 'My Subtitle' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('styled-subtitle')).toHaveTextContent(
        'My Subtitle',
      );
    });

    it('should not render subtitle when not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.queryByTestId('styled-subtitle')).not.toBeInTheDocument();
    });

    it('should render measure when provided', () => {
      render(
        <BasicContainer header={{ title: 'Title', measure: 'Revenue (USD)' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      const measure = screen.getByTestId('styled-measure');
      expect(measure).toHaveTextContent('Revenue (USD)');
      expect(measure).toHaveAttribute('data-size', 'small');
      expect(measure).toHaveAttribute('data-color', 'gray');
      expect(measure).toHaveAttribute('data-weight', 'light');
    });

    it('should not render measure when not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.queryByTestId('styled-measure')).not.toBeInTheDocument();
    });

    it('should render tooltip when provided', () => {
      render(
        <BasicContainer header={{ title: 'Title', tooltip: 'Tooltip content' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
        'Tooltip content',
      );
      expect(screen.getByTestId('hexa-icon')).toBeInTheDocument();
    });

    it('should not render tooltip when not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });

    it('should render tooltip with default background style', () => {
      render(
        <BasicContainer header={{ title: 'Title', tooltip: 'Tooltip' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('data-background-style', 'default');
    });

    it('should render tooltip with transparent background when specified', () => {
      render(
        <BasicContainer
          header={{
            title: 'Title',
            tooltip: 'Tooltip',
            tooltipBackgroundTransparent: true,
          }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('data-background-style', 'transparent');
    });

    it('should pass tooltipSize to CustomTooltip and matching icon size', () => {
      render(
        <BasicContainer
          header={{
            title: 'Title',
            tooltip: 'Tooltip',
            tooltipSize: 'medium',
          }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('data-size', 'medium');
      expect(screen.getByTestId('hexa-icon')).toHaveAttribute(
        'data-size',
        'medium',
      );
    });

    it('should use auto tooltip size and large icon when tooltipSize omitted', () => {
      render(
        <BasicContainer header={{ title: 'Title', tooltip: 'Tooltip' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('custom-tooltip')).toHaveAttribute(
        'data-size',
        'auto',
      );
      expect(screen.getByTestId('hexa-icon')).toHaveAttribute(
        'data-size',
        'large',
      );
    });

    it('should pass structured tooltip as title, subtitle and text', () => {
      render(
        <BasicContainer
          header={{
            title: 'Title',
            tooltip: {
              title: 'Tip title',
              subtitle: 'Tip subtitle',
              text: 'Tip body',
            },
          }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('data-tooltip-title', 'Tip title');
      expect(tooltip).toHaveAttribute('data-tooltip-subtitle', 'Tip subtitle');
      expect(tooltip).toHaveAttribute('data-tooltip-text', 'Tip body');
      expect(screen.getByTestId('tooltip-content')).toBeEmptyDOMElement();
    });

    it('should render refreshDateLabel when provided', () => {
      render(
        <BasicContainer
          header={{ title: 'Title', refreshDateLabel: 'Last updated: Today' }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('styled-refresh-label')).toHaveTextContent(
        'Last updated: Today',
      );
    });

    it('should not render refreshDateLabel when not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(
        screen.queryByTestId('styled-refresh-label'),
      ).not.toBeInTheDocument();
    });

    it('should render tags when provided', () => {
      const tags = [
        { icon: MockIcon, text: 'Tag 1' },
        { icon: MockIcon, text: 'Tag 2' },
      ];

      render(
        <BasicContainer header={{ title: 'Title', tags }}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('container-tags')).toBeInTheDocument();
      const tagElements = screen.getAllByTestId('tag');
      expect(tagElements).toHaveLength(2);
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });

    it('should not render tags container when not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.queryByTestId('container-tags')).not.toBeInTheDocument();
    });

    it('should render rightContent when provided', () => {
      const rightContent = <button data-testid="right-button">Action</button>;

      render(
        <BasicContainer header={{ title: 'Title', rightContent }}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('right-button')).toBeInTheDocument();
    });

    it('should not render extra header-content when rightContent not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      const headerContents = screen.getAllByTestId('header-content');
      expect(headerContents).toHaveLength(2); // Only the main content sections
    });

    it('should render bottomTag when provided', () => {
      const bottomTag = <span data-testid="bottom-tag">Bottom content</span>;

      render(
        <BasicContainer header={{ title: 'Title', bottomTag }}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('bottom-tag')).toBeInTheDocument();
    });

    it('should not render bottomTag when not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.queryByTestId('bottom-tag')).not.toBeInTheDocument();
    });
  });

  describe('Layout Props - Default Values', () => {
    it('should apply default layout when no layout prop provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'small');
      expect(container).toHaveAttribute('data-shadow', 'small');
      expect(container).toHaveAttribute('data-border-radius', 'large');

      const header = screen.getByTestId('styled-header');
      expect(header).toHaveAttribute('data-padding', 'medium');

      const scrollContainer = screen.getByTestId('container-with-scroll');
      expect(scrollContainer).toHaveAttribute('data-padding', 'true');
    });
  });

  describe('Layout Props - Custom Values', () => {
    it('should override default border', () => {
      render(
        <BasicContainer header={defaultHeader} layout={{ border: 'none' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'none');
    });

    it('should override default borderRadius', () => {
      render(
        <BasicContainer
          header={defaultHeader}
          layout={{ borderRadius: 'small' }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border-radius', 'small');
    });

    it('should override default shadow', () => {
      render(
        <BasicContainer header={defaultHeader} layout={{ shadow: 'large' }}>
          {defaultChildren}
        </BasicContainer>,
      );

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-shadow', 'large');
    });

    it('should override default headerPadding', () => {
      render(
        <BasicContainer
          header={defaultHeader}
          layout={{ headerPadding: 'large' }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      const header = screen.getByTestId('styled-header');
      expect(header).toHaveAttribute('data-padding', 'large');
    });

    it('should override default bodyPadding', () => {
      render(
        <BasicContainer header={defaultHeader} layout={{ bodyPadding: false }}>
          {defaultChildren}
        </BasicContainer>,
      );

      const scrollContainer = screen.getByTestId('container-with-scroll');
      expect(scrollContainer).toHaveAttribute('data-padding', 'false');
    });

    it('should merge custom layout with defaults', () => {
      render(
        <BasicContainer
          header={defaultHeader}
          layout={{ border: 'none', shadow: 'large' }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'none');
      expect(container).toHaveAttribute('data-shadow', 'large');
      expect(container).toHaveAttribute('data-border-radius', 'large');
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with all header props', () => {
      const tags = [{ icon: MockIcon, text: 'Tag 1' }];
      const rightContent = <button>Action</button>;
      const bottomTag = <span>Bottom</span>;

      render(
        <BasicContainer
          header={{
            title: 'Complete Title',
            subtitle: 'Complete Subtitle',
            measure: 'USD',
            tooltip: 'Complete Tooltip',
            titleSize: 'H2',
            tags,
            rightContent,
            refreshDateLabel: 'Updated today',
            bottomTag,
            tooltipBackgroundTransparent: true,
          }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByText('Complete Title')).toBeInTheDocument();
      expect(screen.getByText('Complete Subtitle')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
      expect(screen.getByText('Complete Tooltip')).toBeInTheDocument();
      expect(screen.getByText('Updated today')).toBeInTheDocument();
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Bottom')).toBeInTheDocument();
    });

    it('should render with all layout props customized', () => {
      render(
        <BasicContainer
          header={defaultHeader}
          layout={{
            border: 'none',
            borderRadius: 'medium',
            shadow: 'none',
            headerPadding: 'small',
            bodyPadding: false,
          }}
        >
          {defaultChildren}
        </BasicContainer>,
      );

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-border', 'none');
      expect(container).toHaveAttribute('data-border-radius', 'medium');
      expect(container).toHaveAttribute('data-shadow', 'none');

      const header = screen.getByTestId('styled-header');
      expect(header).toHaveAttribute('data-padding', 'small');

      const scrollContainer = screen.getByTestId('container-with-scroll');
      expect(scrollContainer).toHaveAttribute('data-padding', 'false');
    });

    it('should render multiple children', () => {
      render(
        <BasicContainer header={defaultHeader}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </BasicContainer>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render with complex children', () => {
      const complexChildren = (
        <div>
          <h2>Section Title</h2>
          <p>Section content</p>
          <table data-testid="table">
            <tbody>
              <tr>
                <td>Data</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      render(
        <BasicContainer header={defaultHeader}>
          {complexChildren}
        </BasicContainer>,
      );

      expect(screen.getByText('Section Title')).toBeInTheDocument();
      expect(screen.getByText('Section content')).toBeInTheDocument();
      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });

  describe('ContainerWithScroll Props', () => {
    it('should pass correct background to ContainerWithScroll', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      const scrollContainer = screen.getByTestId('container-with-scroll');
      expect(scrollContainer).toHaveAttribute('data-background', 'white');
    });

    it('should pass bodyPadding to ContainerWithScroll', () => {
      render(
        <BasicContainer header={defaultHeader} layout={{ bodyPadding: true }}>
          {defaultChildren}
        </BasicContainer>,
      );

      const scrollContainer = screen.getByTestId('container-with-scroll');
      expect(scrollContainer).toHaveAttribute('data-padding', 'true');
    });
  });

  describe('dataTestId Prop', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(
        <BasicContainer header={defaultHeader} dataTestId="card-overview">
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('card-overview')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      render(
        <BasicContainer header={defaultHeader}>
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    });

    it('should render with the exact dataTestId provided', () => {
      render(
        <BasicContainer
          header={defaultHeader}
          dataTestId="section-brand-performance"
        >
          {defaultChildren}
        </BasicContainer>,
      );

      expect(
        screen.getByTestId('section-brand-performance'),
      ).toBeInTheDocument();
    });

    it('should render data-testid on header element', () => {
      render(
        <BasicContainer header={defaultHeader} dataTestId="card-overview">
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('card-overview-header')).toBeInTheDocument();
    });

    it('should render data-testid on title element', () => {
      render(
        <BasicContainer header={defaultHeader} dataTestId="card-overview">
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('card-overview-title')).toBeInTheDocument();
    });

    it('should render data-testid on content element', () => {
      render(
        <BasicContainer header={defaultHeader} dataTestId="card-overview">
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('card-overview-content')).toBeInTheDocument();
    });

    it('should render data-testid on tooltip icon when tooltip is provided', () => {
      render(
        <BasicContainer
          header={{ title: 'Title', tooltip: 'Tooltip content' }}
          dataTestId="card-overview"
        >
          {defaultChildren}
        </BasicContainer>,
      );

      expect(screen.getByTestId('card-overview-tooltip')).toBeInTheDocument();
    });
  });
});

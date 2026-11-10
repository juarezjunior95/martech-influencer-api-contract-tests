import { render, screen } from '@testing-library/react';

import { ResponsiveBasicContainer } from './ResponsiveBasicContainer';

jest.mock('components/BasicContainer', () => ({
  BasicContainer: ({
    children,
    header,
    layout,
    fullWidth,
    dataTestId,
  }: {
    children: React.ReactNode;
    header: { title: string };
    layout?: object;
    fullWidth?: boolean;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'basic-container'}
      data-fullwidth={fullWidth?.toString()}
      data-layout={JSON.stringify(layout)}
    >
      <h1 data-testid="title">{header.title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('./ResponsiveBasicContainer.styles', () => ({
  ResponsiveWrapper: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'responsive-wrapper'}>{children}</div>,
}));

describe('ResponsiveBasicContainer', () => {
  const defaultHeader = {
    title: 'Test Title',
  };

  const defaultChildren = <div data-testid="test-children">Test Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the ResponsiveWrapper', () => {
      render(
        <ResponsiveBasicContainer header={defaultHeader}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      expect(
        screen.getByTestId('responsive-basic-container-undefined'),
      ).toBeInTheDocument();
    });

    it('should render BasicContainer inside ResponsiveWrapper', () => {
      render(
        <ResponsiveBasicContainer header={defaultHeader}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      const wrapper = screen.getByTestId(
        'responsive-basic-container-undefined',
      );
      const basicContainer = screen.getByTestId('basic-container');

      expect(wrapper).toContainElement(basicContainer);
    });

    it('should render children inside BasicContainer', () => {
      render(
        <ResponsiveBasicContainer header={defaultHeader}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('should render header title', () => {
      render(
        <ResponsiveBasicContainer header={{ title: 'My Custom Title' }}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      expect(screen.getByTestId('title')).toHaveTextContent('My Custom Title');
    });
  });

  describe('Props Forwarding', () => {
    it('should always pass fullWidth as true to BasicContainer', () => {
      render(
        <ResponsiveBasicContainer header={defaultHeader}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      const basicContainer = screen.getByTestId('basic-container');
      expect(basicContainer).toHaveAttribute('data-fullwidth', 'true');
    });

    it('should forward header props to BasicContainer', () => {
      const headerProps = {
        title: 'Custom Title',
        subtitle: 'Custom Subtitle',
        measure: 'USD',
      };

      render(
        <ResponsiveBasicContainer header={headerProps}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      expect(screen.getByTestId('title')).toHaveTextContent('Custom Title');
    });

    it('should forward layout props to BasicContainer', () => {
      const layoutProps = {
        border: 'none' as const,
        shadow: 'large' as const,
      };

      render(
        <ResponsiveBasicContainer header={defaultHeader} layout={layoutProps}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      const basicContainer = screen.getByTestId('basic-container');
      expect(basicContainer).toHaveAttribute(
        'data-layout',
        JSON.stringify(layoutProps),
      );
    });

    it('should forward dataTestId to BasicContainer', () => {
      render(
        <ResponsiveBasicContainer
          header={defaultHeader}
          dataTestId="my-container"
        >
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      expect(screen.getByTestId('my-container')).toBeInTheDocument();
    });
  });

  describe('Data Test ID', () => {
    it('should generate correct data-testid for ResponsiveWrapper with dataTestId', () => {
      render(
        <ResponsiveBasicContainer
          header={defaultHeader}
          dataTestId="custom-test-id"
        >
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      expect(
        screen.getByTestId('responsive-basic-container-custom-test-id'),
      ).toBeInTheDocument();
    });

    it('should generate data-testid with undefined when no dataTestId provided', () => {
      render(
        <ResponsiveBasicContainer header={defaultHeader}>
          {defaultChildren}
        </ResponsiveBasicContainer>,
      );

      expect(
        screen.getByTestId('responsive-basic-container-undefined'),
      ).toBeInTheDocument();
    });
  });
});

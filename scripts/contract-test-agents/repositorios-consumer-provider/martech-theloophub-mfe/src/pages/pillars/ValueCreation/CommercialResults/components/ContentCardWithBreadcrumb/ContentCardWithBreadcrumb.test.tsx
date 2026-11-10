import React from 'react';

import { render } from '@testing-library/react';

import { ContentCardWithBreadcrumb } from './ContentCardWithBreadcrumb';

jest.mock('@hexa-ui/components', () => ({
  Heading: ({ children, ...props }: { children: React.ReactNode }) => (
    <div {...props}>{children}</div>
  ),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: () => <div data-testid="icon" />,
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: 'InfoIcon',
}));

jest.mock('components', () => ({
  CustomTooltip: ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: React.ReactNode;
  }) => (
    <div data-testid="custom-tooltip">
      {content}
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledMainContainer: ({
    children,
    fullWidth: _fullWidth,
    ...props
  }: {
    children: React.ReactNode;
    fullWidth?: boolean;
  }) => <div {...props}>{children}</div>,
  StyledTooltip: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

const renderComponent = () => {
  return render(
    <ContentCardWithBreadcrumb
      title="Test Title"
      tooltip="Test Tooltip"
      dataTestId="content-card-with-breadcrumb"
    >
      <div data-testid="child">Test Content</div>
    </ContentCardWithBreadcrumb>,
  );
};
describe('ContentCardWithBreadcrumb', () => {
  it('should render the component', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('content-card-with-breadcrumb')).toBeInTheDocument();
  });

  it('should render the title', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('content-card-with-breadcrumb-title')).toHaveTextContent(
      'Test Title',
    );
  });
  it('should render the breadcrumb', () => {
    const { getByTestId } = renderComponent();

    expect(
      getByTestId('content-card-with-breadcrumb-breadcrumb'),
    ).toHaveTextContent('Breadcrumb');
  });
});

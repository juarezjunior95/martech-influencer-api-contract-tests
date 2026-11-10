import { render, screen } from '@testing-library/react';

jest.mock('react-select', () => ({
  components: {
    GroupHeading: ({ children, ...props }: any) => (
      <div data-testid={props['data-testid'] || 'group-heading'}>
        {children}
      </div>
    ),
  },
}));

import { CustomGroupHeading } from './CustomGroupHeading';

describe('CustomGroupHeading', () => {
  const createMockProps = (label: string, extraSelectProps = {}) => ({
    data: { label },
    children: 'Group Label',
    id: 'group-1',
    selectProps: { ...extraSelectProps },
    cx: jest.fn(),
    getStyles: jest.fn(),
    getClassNames: jest.fn(),
    theme: {} as any,
  });

  it('should render GroupHeading when label is provided', () => {
    render(<CustomGroupHeading {...(createMockProps('Test Group') as any)} />);

    expect(screen.getByTestId('group-heading')).toBeInTheDocument();
  });

  it('should render children when label is provided', () => {
    render(<CustomGroupHeading {...(createMockProps('Test Group') as any)} />);

    expect(screen.getByText('Group Label')).toBeInTheDocument();
  });

  it('should return null when label is empty', () => {
    const { container } = render(
      <CustomGroupHeading {...(createMockProps('') as any)} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should return null when label is "Ungrouped"', () => {
    const { container } = render(
      <CustomGroupHeading {...(createMockProps('Ungrouped') as any)} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render for any other label value', () => {
    render(<CustomGroupHeading {...(createMockProps('Category A') as any)} />);

    expect(screen.getByTestId('group-heading')).toBeInTheDocument();
  });

  describe('data-testid', () => {
    it('should render dynamic data-testid when provided', () => {
      const props = createMockProps('Test Group', { dataTestId: 'my-select' });

      render(<CustomGroupHeading {...(props as any)} />);

      expect(screen.getByTestId('my-select-group-heading')).toBeInTheDocument();
    });

    it('should NOT render dynamic data-testid if not provided', () => {
      render(
        <CustomGroupHeading {...(createMockProps('Test Group') as any)} />,
      );

      const element = screen.getByTestId('group-heading');
      expect(element.getAttribute('data-testid')).toBe('group-heading');
    });
  });
});

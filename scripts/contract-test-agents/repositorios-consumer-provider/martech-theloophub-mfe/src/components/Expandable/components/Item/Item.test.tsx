import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { ExpandableProvider } from '../../../../contexts/Expandable';
import { Item, ItemProps } from './Item';

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => jest.fn(),
}));

jest.mock('components/deprecated', () => ({
  BigNumber: ({ data }: { data: { title?: string; measure?: string } }) => (
    <div data-testid="big-number">
      <span>{data?.title}</span>
      <span>{data?.measure}</span>
    </div>
  ),
}));

jest.mock('components/Expand/Expand', () => ({
  Expand: ({
    disabled,
    onValueChange,
    dataTestId,
  }: {
    disabled?: boolean;
    onValueChange: () => void;
    dataTestId?: string;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onValueChange}
      data-testid={dataTestId ? `${dataTestId}-maximize` : undefined}
    >
      Expand
    </button>
  ),
}));

jest.mock('./Item.styles', () => ({
  StyledItemCard: ({ children, ...rest }: any) => (
    <div {...rest}>{children}</div>
  ),
  StyledItemHeaderContainer: ({ children, ...rest }: any) => (
    <div {...rest}>{children}</div>
  ),
  StyledItemButtomContainer: ({ children, ...rest }: any) => (
    <div {...rest}>{children}</div>
  ),
}));

const setup = (props: Partial<ItemProps> = {}) => {
  const defaultProps: ItemProps = {
    id: 'test-item',
    expand: 'enabled',
    expandableChildren: (
      <div data-testid="expandable-content">Expanded Content</div>
    ),
    colapsedChildren: (
      <div data-testid="collapsed-content">Collapsed Content</div>
    ),
    bigNumberHeaderData: {
      title: 'Test Title',
      measure: '100',
    },
  };
  return render(
    <ExpandableProvider>
      <Item {...defaultProps} {...props} />
    </ExpandableProvider>,
  );
};

describe('Expandable.Item', () => {
  it('renders collapsed content initially', () => {
    setup();
    expect(screen.queryByTestId('collapsed-content')).toBeInTheDocument();
    expect(screen.queryByTestId('expandable-content')).not.toBeInTheDocument();
  });

  it('renders expandable content when expanded', () => {
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByTestId('expandable-content')).toBeInTheDocument();
    expect(screen.queryByTestId('collapsed-content')).not.toBeInTheDocument();
  });

  it('renders BigNumber with correct props when expanded', () => {
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays error when used without Expandable context', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);
    render(<Item id="no-context" expandableChildren={<div />} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Expandable.Item must be used within Expandable.Container with expand active!',
    );
    consoleSpy.mockRestore();
  });

  it('handles the "disabled" expand mode correctly', () => {
    setup({ expand: 'disabled' });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should render with custom dataTestId and pass it to Expand button', () => {
    setup({ dataTestId: 'custom-item-id' });

    expect(screen.getByTestId('custom-item-id')).toBeInTheDocument();

    const expandBtn = screen.getByTestId(
      'custom-item-id-expand-button-maximize',
    );
    expect(expandBtn).toBeInTheDocument();
  });
});

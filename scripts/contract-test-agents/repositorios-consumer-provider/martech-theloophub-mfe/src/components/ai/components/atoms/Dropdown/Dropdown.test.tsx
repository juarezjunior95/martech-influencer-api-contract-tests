import { fireEvent, render, screen } from '@testing-library/react';

import { Dropdown } from './Dropdown';

const renderDropdown = (onRename = jest.fn(), onDelete = jest.fn()) =>
  render(
    <Dropdown>
      {({ open, toggle }) => (
        <>
          <Dropdown.Trigger
            open={open}
            onClick={toggle}
            icon={<span>⋮</span>}
            aria-label="Options"
          />
          <Dropdown.Menu open={open} onClose={toggle}>
            <Dropdown.Item onClick={onRename}>Rename</Dropdown.Item>
            <Dropdown.Item destructive onClick={onDelete}>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </>
      )}
    </Dropdown>,
  );

const renderDropdownWithChildren = (
  onRename = jest.fn(),
  onDelete = jest.fn(),
) =>
  render(
    <Dropdown>
      {({ open, toggle }) => (
        <>
          <Dropdown.Trigger
            open={open}
            onClick={toggle}
            icon={<span data-testid="trigger-icon">⋮</span>}
          >
            Actions
          </Dropdown.Trigger>
          <Dropdown.Menu open={open} onClose={toggle}>
            <Dropdown.Item onClick={onRename}>Rename</Dropdown.Item>
            <Dropdown.Item destructive onClick={onDelete}>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </>
      )}
    </Dropdown>,
  );

describe('Dropdown', () => {
  it('should not show menu initially', () => {
    renderDropdown();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should show menu when trigger is clicked', () => {
    renderDropdown();
    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('menu')).toBeVisible();
  });

  it('should call item onClick when clicked', () => {
    const onRename = jest.fn();
    renderDropdown(onRename);
    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    fireEvent.click(screen.getByText('Rename'));
    expect(onRename).toHaveBeenCalledTimes(1);
  });

  it('should render destructive item', () => {
    renderDropdown();
    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should close menu when clicking outside', () => {
    renderDropdown();
    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('menu')).toBeVisible();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should render menu items with role menuitem', () => {
    renderDropdown();
    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  describe('accessibility', () => {
    const getTrigger = () => screen.getByRole('button', { name: 'Options' });

    it('should have aria-haspopup="menu" on trigger', () => {
      renderDropdown();
      const trigger = getTrigger();
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should have aria-expanded="false" initially', () => {
      renderDropdown();
      const trigger = getTrigger();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should have aria-expanded="true" when open', () => {
      renderDropdown();
      const trigger = getTrigger();
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('trigger with children', () => {
    it('should render trigger text label', () => {
      renderDropdownWithChildren();
      expect(
        screen.getByRole('button', { name: /Actions/i }),
      ).toBeInTheDocument();
    });

    it('should render icon alongside text', () => {
      renderDropdownWithChildren();
      expect(screen.getByTestId('trigger-icon')).toBeInTheDocument();
    });

    it('should open menu when trigger with children is clicked', () => {
      renderDropdownWithChildren();
      fireEvent.click(screen.getByRole('button', { name: /Actions/i }));
      expect(screen.getByRole('menu')).toBeVisible();
    });

    it('should call item onClick from children trigger', () => {
      const onRename = jest.fn();
      renderDropdownWithChildren(onRename);
      fireEvent.click(screen.getByRole('button', { name: /Actions/i }));
      fireEvent.click(screen.getByText('Rename'));
      expect(onRename).toHaveBeenCalledTimes(1);
    });
  });

  describe('keyboard navigation', () => {
    it('should focus first item when menu opens', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const items = screen.getAllByRole('menuitem');
      expect(items[0]).toHaveFocus();
    });

    it('should move focus down with ArrowDown', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const menu = screen.getByRole('menu');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      const items = screen.getAllByRole('menuitem');
      expect(items[1]).toHaveFocus();
    });

    it('should wrap focus from last to first with ArrowDown', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const menu = screen.getByRole('menu');
      const items = screen.getAllByRole('menuitem');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      expect(items[0]).toHaveFocus();
    });

    it('should move focus up with ArrowUp', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const menu = screen.getByRole('menu');
      const items = screen.getAllByRole('menuitem');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      expect(items[0]).toHaveFocus();
    });

    it('should wrap focus from first to last with ArrowUp', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const menu = screen.getByRole('menu');
      const items = screen.getAllByRole('menuitem');
      fireEvent.keyDown(menu, { key: 'ArrowUp' });
      expect(items[items.length - 1]).toHaveFocus();
    });

    it('should focus first item with Home', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const menu = screen.getByRole('menu');
      const items = screen.getAllByRole('menuitem');
      fireEvent.keyDown(menu, { key: 'ArrowDown' });
      fireEvent.keyDown(menu, { key: 'Home' });
      expect(items[0]).toHaveFocus();
    });

    it('should focus last item with End', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const menu = screen.getByRole('menu');
      const items = screen.getAllByRole('menuitem');
      fireEvent.keyDown(menu, { key: 'End' });
      expect(items[items.length - 1]).toHaveFocus();
    });

    it('should close menu on Escape', () => {
      renderDropdown();
      fireEvent.click(screen.getByRole('button', { name: 'Options' }));
      const menu = screen.getByRole('menu');
      fireEvent.keyDown(menu, { key: 'Escape' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});

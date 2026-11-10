import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../Button/Button';
import { Container, Item, Menu } from './Dropdown.styles';
import { useDropdownPosition } from './useDropdownPosition';

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

function DropdownRoot({ children, className }: Readonly<DropdownProps>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    document.addEventListener('mousedown', handleClickOutside);

    const handleScroll = (e: Event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, handleClickOutside]);

  return (
    <Container ref={containerRef} className={className}>
      {typeof children === 'function'
        ? (
            children as (props: {
              open: boolean;
              toggle: () => void;
            }) => ReactNode
          )({
            open,
            toggle: () => setOpen((prev) => !prev),
          })
        : children}
    </Container>
  );
}

type DropdownTriggerBaseProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'variant' | 'size' | 'iconMode' | 'startContent' | 'children' | 'onClick'
>;

type DropdownTriggerProps = DropdownTriggerBaseProps & {
  icon?: ReactNode;
  open?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

function DropdownTrigger({
  open,
  onClick,
  className,
  icon,
  onKeyDown,
  type = 'button',
  children,
  ...rest
}: Readonly<DropdownTriggerProps>) {
  return (
    <Button
      {...rest}
      type={type}
      variant="transparent"
      size="small"
      tabIndex={0}
      aria-expanded={open}
      aria-haspopup="menu"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={className}
      iconMode={!children && !!icon}
      startContent={icon}
    >
      {children}
    </Button>
  );
}

interface DropdownMenuProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

function DropdownMenu({
  open,
  onClose,
  children,
  className,
}: Readonly<DropdownMenuProps>) {
  const menuRef = useRef<HTMLDivElement>(null);

  const { position } = useDropdownPosition({
    open,
    menuRef,
    children,
  });

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const firstItem =
      menuRef.current.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current;
    if (!menu) return;

    const items = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[next]?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prev]?.focus();
        break;
      }
      case 'Home': {
        e.preventDefault();
        items[0]?.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      }
      case 'Escape': {
        e.preventDefault();
        onClose?.();
        break;
      }
    }
  };

  if (!open) return null;

  return (
    <Menu
      ref={menuRef}
      visible
      className={className}
      role="menu"
      onKeyDown={handleKeyDown}
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </Menu>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
  onClick?: () => void;
  className?: string;
}

function DropdownItem({
  children,
  icon,
  destructive,
  onClick,
  className,
}: Readonly<DropdownItemProps>) {
  return (
    <Item
      type="button"
      role="menuitem"
      tabIndex={-1}
      destructive={destructive}
      onClick={onClick}
      className={className}
    >
      {icon}
      {children}
    </Item>
  );
}

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
  Item: DropdownItem,
});

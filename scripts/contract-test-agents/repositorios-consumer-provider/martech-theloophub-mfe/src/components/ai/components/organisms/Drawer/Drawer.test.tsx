import { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer';

const DrawerWrapper = ({
  defaultOpen = false,
  ...props
}: {
  defaultOpen?: boolean;
  [key: string]: any;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent {...props}>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerHeader>
          <DrawerTitle>Test Title</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <DrawerBody>
          <p>Drawer Content</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

describe('Drawer', () => {
  describe('Drawer (Root)', () => {
    it('should render children', () => {
      render(<DrawerWrapper />);
      expect(screen.getByText('Open Drawer')).toBeInTheDocument();
    });
  });

  describe('DrawerTrigger', () => {
    it('should render trigger button', () => {
      render(<DrawerWrapper />);
      expect(screen.getByText('Open Drawer')).toBeInTheDocument();
    });

    it('should toggle drawer when clicked', () => {
      render(<DrawerWrapper />);

      const trigger = screen.getByText('Open Drawer');
      fireEvent.click(trigger);

      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });
    });

    it('should have aria-expanded attribute', () => {
      render(<DrawerWrapper />);
      const trigger = screen.getByRole('button', { name: /open drawer/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('DrawerContent', () => {
    it('should render content when open', () => {
      render(<DrawerWrapper defaultOpen />);
      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('should have dialog role', () => {
      render(<DrawerWrapper defaultOpen />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(<DrawerWrapper defaultOpen />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should apply custom width', () => {
      render(<DrawerWrapper width={500} />);
      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(wrapper).toHaveStyle({ width: '500px' });
    });

    it('should show overlay by default', () => {
      render(<DrawerWrapper />);
      expect(screen.getByTestId('drawer-overlay')).toBeInTheDocument();
    });

    it('should hide overlay when showOverlay is false', () => {
      render(<DrawerWrapper showOverlay={false} />);
      expect(screen.queryByTestId('drawer-overlay')).not.toBeInTheDocument();
    });
  });

  describe('DrawerHeader', () => {
    it('should render header', () => {
      render(<DrawerWrapper />);
      expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
    });
  });

  describe('DrawerTitle', () => {
    it('should render title', () => {
      render(<DrawerWrapper />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should be an h2 element', () => {
      render(<DrawerWrapper />);
      expect(screen.getByText('Test Title').tagName).toBe('H2');
    });
  });

  describe('DrawerBody', () => {
    it('should render body content', () => {
      render(<DrawerWrapper />);
      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });
  });

  describe('DrawerClose', () => {
    it('should render close button', () => {
      render(<DrawerWrapper defaultOpen />);
      const dialog = screen.getByRole('dialog');
      const closeButton = dialog.querySelector('[aria-label="Close drawer"]');
      expect(closeButton).toBeInTheDocument();
    });

    it('should close drawer when clicked', () => {
      render(<DrawerWrapper defaultOpen />);

      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });

      const dialog = screen.getByRole('dialog');
      const closeButton = dialog.querySelector(
        '[aria-label="Close drawer"]',
      ) as HTMLButtonElement;
      fireEvent.click(closeButton);
      expect(wrapper).toHaveStyle({ transform: 'translateX(100%)' });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close drawer when Escape is pressed', () => {
      render(<DrawerWrapper defaultOpen />);

      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(wrapper).toHaveStyle({ transform: 'translateX(100%)' });
    });

    it('should not close on Escape when closeOnEscape is false', () => {
      render(<DrawerWrapper defaultOpen closeOnEscape={false} />);

      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });
    });
  });

  describe('Overlay Click', () => {
    it('should close drawer when overlay is clicked', () => {
      render(<DrawerWrapper defaultOpen />);

      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });

      const overlay = screen.getByTestId('drawer-overlay');
      fireEvent.click(overlay);
      expect(wrapper).toHaveStyle({ transform: 'translateX(100%)' });
    });

    it('should not close when closeOnOverlayClick is false', () => {
      render(<DrawerWrapper defaultOpen closeOnOverlayClick={false} />);

      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });

      const overlay = screen.getByTestId('drawer-overlay');
      fireEvent.click(overlay);
      expect(wrapper).toHaveStyle({ transform: 'translateX(0)' });
    });
  });

  describe('Contained Mode', () => {
    it('should have contained styles when contained is true', () => {
      render(<DrawerWrapper contained />);

      const overlay = screen.getByTestId('drawer-overlay');
      const wrapper = screen.getByTestId('drawer-wrapper');
      expect(overlay).toHaveStyle({ position: 'absolute' });
      expect(wrapper).toHaveStyle({ position: 'absolute' });
    });
  });

  describe('Custom Trigger', () => {
    it('should render custom trigger with asChild', () => {
      const CustomWrapper = () => {
        const [open, setOpen] = useState(false);
        return (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <DrawerTrigger asChild>
                <button data-testid="custom-trigger">Custom Button</button>
              </DrawerTrigger>
            </DrawerContent>
          </Drawer>
        );
      };

      render(<CustomWrapper />);
      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    });
  });
});

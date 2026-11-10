import { fireEvent, render, screen } from '@testing-library/react';

import { Modal } from './Modal';

const renderModal = (open = true, onOpenChange = jest.fn()) =>
  render(
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <h2>Test Modal</h2>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>Body content</Modal.Body>
        <Modal.Footer>
          <button type="button">Submit</button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>,
  );

describe('Modal', () => {
  describe('Rendering', () => {
    it('should render dialog when open', () => {
      renderModal(true);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render dialog when closed', () => {
      renderModal(false);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render title', () => {
      renderModal(true);
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('should render body content', () => {
      renderModal(true);
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('should render footer content', () => {
      renderModal(true);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      renderModal(true);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('Close behavior', () => {
    it('should call onOpenChange when close button is clicked', () => {
      const onOpenChange = jest.fn();
      renderModal(true, onOpenChange);

      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange when overlay is clicked', () => {
      const onOpenChange = jest.fn();
      renderModal(true, onOpenChange);

      const overlay = document.querySelector('[aria-hidden="true"]');
      fireEvent.click(overlay!);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange on Escape key', () => {
      const onOpenChange = jest.fn();
      renderModal(true, onOpenChange);

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not close on overlay click when closeOnClick is false', () => {
      const onOpenChange = jest.fn();
      render(
        <Modal open onOpenChange={onOpenChange}>
          <Modal.Overlay closeOnClick={false} />
          <Modal.Content>
            <Modal.Body>Content</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      fireEvent.click(overlay!);
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should not close on Escape when closeOnEscape is false', () => {
      const onOpenChange = jest.fn();
      render(
        <Modal open onOpenChange={onOpenChange}>
          <Modal.Content closeOnEscape={false}>
            <Modal.Body>Content</Modal.Body>
          </Modal.Content>
        </Modal>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Content click propagation', () => {
    it('should not close when clicking inside content', () => {
      const onOpenChange = jest.fn();
      renderModal(true, onOpenChange);

      fireEvent.click(screen.getByText('Body content'));
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Context error', () => {
    it('should throw when compound components are used outside Modal', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() =>
        render(
          <Modal.Content>
            <div />
          </Modal.Content>,
        ),
      ).toThrow('Modal compound components must be used within <Modal>');

      consoleSpy.mockRestore();
    });
  });
});

import { Button } from '../../atoms/Button';
import { Modal } from '../../organisms/Modal';
import { Description, Title } from './DeleteConfirmationModal.styles';

interface DeleteConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal = ({
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => (
  <Modal open={open} onOpenChange={(o) => !o && onCancel()} fullscreen={false}>
    <Modal.Overlay />
    <Modal.Content size="sm">
      <Modal.Header>
        <Title>Delete chat?</Title>
        <Modal.Close />
      </Modal.Header>
      <Modal.Body>
        <Description>This action cannot be undone.</Description>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal.Content>
  </Modal>
);

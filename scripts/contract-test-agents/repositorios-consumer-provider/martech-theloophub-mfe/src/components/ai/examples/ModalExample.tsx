import { useState } from 'react';

import { Button } from '../components/atoms/Button';
import { Checkbox } from '../components/atoms/Checkbox';
import { Modal } from '../components/organisms/Modal';
import type { ModalSize } from '../components/organisms/Modal/Modal.styles';
import { Sandbox } from '../components/organisms/Sandbox';

const FeedbackContent = ({
  onClose,
  checked,
  onToggle,
}: {
  onClose: () => void;
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
}) => (
  <>
    <Modal.Header>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
        Help us improve this response
      </h2>
      <Modal.Close />
    </Modal.Header>
    <Modal.Body>
      <p
        style={{
          margin: '8px 0 4px',
          fontSize: 14,
          fontWeight: 600,
          color: '#0a0a0a',
        }}
      >
        What went wrong?{' '}
        <span style={{ fontWeight: 400, color: '#5c5c5c' }}>(Optional)</span>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Checkbox
          checked={!!checked.inaccurate}
          onChange={() => onToggle('inaccurate')}
          label="Inaccurate"
        />
        <Checkbox
          checked={!!checked.notAsked}
          onChange={() => onToggle('notAsked')}
          label="Not what I asked"
        />
        <Checkbox
          checked={!!checked.incomplete}
          onChange={() => onToggle('incomplete')}
          label="Incomplete"
        />
        <Checkbox
          checked={!!checked.other}
          onChange={() => onToggle('other')}
          label="Other"
        />
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={onClose}>
        Submit
      </Button>
    </Modal.Footer>
  </>
);

const DeleteContent = ({ onClose }: { onClose: () => void }) => (
  <>
    <Modal.Header>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Delete chat?</h2>
      <Modal.Close />
    </Modal.Header>
    <Modal.Body>
      <p style={{ margin: 0, fontSize: 14, color: '#5c5c5c' }}>
        This action cannot be undone.
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="transparent" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={onClose}>
        Delete
      </Button>
    </Modal.Footer>
  </>
);

const SIZES: ModalSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const ModalExample = () => {
  const [sizeModalOpen, setSizeModalOpen] = useState<ModalSize | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const closeModal = () => setSizeModalOpen(null);

  return (
    <Sandbox
      title="Modal — Size Variants"
      description="xs (288px) · sm (400px) · md (522px, default) · lg (640px) · xl (800px)"
    >
      <div style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SIZES.map((size) => (
            <Button key={size} onClick={() => setSizeModalOpen(size)}>
              {size.toUpperCase()}
            </Button>
          ))}
        </div>

        <Modal
          open={sizeModalOpen !== null}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        >
          <Modal.Overlay />
          <Modal.Content size={sizeModalOpen ?? 'md'}>
            {sizeModalOpen === 'xs' ? (
              <DeleteContent onClose={closeModal} />
            ) : (
              <FeedbackContent
                onClose={closeModal}
                checked={checked}
                onToggle={handleToggle}
              />
            )}
          </Modal.Content>
        </Modal>
      </div>
    </Sandbox>
  );
};

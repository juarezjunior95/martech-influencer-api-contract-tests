import { useCallback, useEffect, useRef, useState } from 'react';

import { copyToClipboard } from '../../../utils/copyToClipboard';
import { Check, Copy } from '../../atoms/Icon';
import { MarkdownRenderer } from '../../atoms/MarkdownRenderer';
import { Tooltip } from '../../atoms/Tooltip';
import { Modal } from '../../organisms/Modal';
import {
  BodyContent,
  CopyTooltipWrapper,
  ErrorState,
  HeaderActions,
  ModalTitle,
  StyledCopyButton,
  StyledModalBody,
  StyledModalContent,
  StyledModalHeader,
} from './ArtifactModal.styles';
import { ArtifactModalSkeleton } from './ArtifactModalSkeleton';

interface ArtifactModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  blobPath?: string;
  blobContent?: string | null;
  blobLoading?: boolean;
  blobError?: boolean;
  onLoadBlob?: (blobPath: string) => void;
}

const COPIED_DURATION = 2000;

export const ArtifactModal = ({
  title,
  open,
  onClose,
  blobPath,
  blobContent,
  blobLoading = false,
  blobError = false,
  onLoadBlob,
}: ArtifactModalProps) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = useCallback(() => {
    if (blobContent) {
      copyToClipboard(blobContent);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), COPIED_DURATION);
    }
  }, [blobContent]);

  useEffect(() => {
    if (open && blobPath && onLoadBlob) {
      onLoadBlob(blobPath);
    }
  }, [open, blobPath, onLoadBlob]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()} fullscreen>
      <Modal.Overlay />
      <StyledModalContent size="xl">
        <StyledModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <HeaderActions>
            {!blobLoading && (
              <CopyTooltipWrapper>
                <Tooltip
                  content={copied ? 'Copied' : 'Copy'}
                  position="bottom"
                  forceVisible={copied}
                >
                  <StyledCopyButton
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied' : 'Copy'}
                    $copied={copied}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </StyledCopyButton>
                </Tooltip>
              </CopyTooltipWrapper>
            )}
            <Modal.Close />
          </HeaderActions>
        </StyledModalHeader>
        <StyledModalBody>
          {blobLoading && (
            <BodyContent>
              <ArtifactModalSkeleton />
            </BodyContent>
          )}
          {blobError && (
            <ErrorState data-testid="error">
              Error. Please try again later.
            </ErrorState>
          )}
          {!blobLoading && !blobError && blobContent && (
            <BodyContent>
              <MarkdownRenderer content={blobContent} />
            </BodyContent>
          )}
        </StyledModalBody>
      </StyledModalContent>
    </Modal>
  );
};

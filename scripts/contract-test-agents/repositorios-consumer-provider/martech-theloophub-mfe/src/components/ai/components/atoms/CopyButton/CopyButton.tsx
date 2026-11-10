import { useCallback, useEffect, useRef, useState } from 'react';

import { copyToClipboard } from '../../../utils/copyToClipboard';
import { Check, Copy } from '../Icon';
import { Tooltip } from '../Tooltip';
import { StyledCopyButton } from './CopyButton.styles';

const COPIED_DURATION = 2000;

export interface CopyButtonProps {
  content: string;
  iconSize?: number;
  className?: string;
  ariaLabelCopy?: string;
  ariaLabelCopied?: string;
  tooltipCopyLabel?: string;
  tooltipCopiedLabel?: string;
  onError?: (err: unknown) => void;
}

export const CopyButton = ({
  content,
  iconSize = 18,
  className,
  ariaLabelCopy = 'Copy',
  ariaLabelCopied = 'Copied',
  tooltipCopyLabel = 'Copy',
  tooltipCopiedLabel = 'Copied',
  onError,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const copiedRef = useRef(false);

  const handleCopy = useCallback(async () => {
    if (copiedRef.current) return;
    copiedRef.current = true;
    try {
      await copyToClipboard(content);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
        copiedRef.current = false;
      }, COPIED_DURATION);
    } catch (err) {
      copiedRef.current = false;
      console.error('[CopyButton] copy failed', err);
      onError?.(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <Tooltip
      content={copied ? tooltipCopiedLabel : tooltipCopyLabel}
      position="bottom"
      delay={0}
      forceVisible={copied}
    >
      <StyledCopyButton
        type="button"
        variant="transparent"
        size="small"
        iconMode
        className={className}
        onClick={handleCopy}
        aria-label={copied ? ariaLabelCopied : ariaLabelCopy}
        $copied={copied}
        aria-live="polite"
        startContent={
          copied ? <Check size={iconSize} /> : <Copy size={iconSize} />
        }
      />
    </Tooltip>
  );
};

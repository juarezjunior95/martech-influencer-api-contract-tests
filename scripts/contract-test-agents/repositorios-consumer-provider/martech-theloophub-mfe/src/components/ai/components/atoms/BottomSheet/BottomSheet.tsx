import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Close } from '../Icon';
import {
  SheetBody,
  SheetCloseButton,
  SheetContainer,
  SheetHeader,
} from './BottomSheet.styles';

export interface BottomSheetProps {
  title?: ReactNode;
  children: ReactNode;
  isClosing: boolean;
  onCloseClick: () => void;
  onAnimationEnd: () => void;
  container?: HTMLElement;
  ariaLabel?: string;
}

export const BottomSheet = ({
  title,
  children,
  isClosing,
  onCloseClick,
  onAnimationEnd,
  container,
  ariaLabel,
}: BottomSheetProps) => {
  const content = (
    <SheetContainer
      role="dialog"
      aria-label={ariaLabel}
      isClosing={isClosing}
      onAnimationEnd={onAnimationEnd}
    >
      <SheetHeader>
        <SheetCloseButton
          type="button"
          variant="transparent"
          size="medium"
          iconMode
          onClick={onCloseClick}
          aria-label="Close"
          startContent={<Close size={20} />}
        />
        {title}
      </SheetHeader>
      <SheetBody>{children}</SheetBody>
    </SheetContainer>
  );

  if (container) {
    return createPortal(content, container);
  }

  return content;
};

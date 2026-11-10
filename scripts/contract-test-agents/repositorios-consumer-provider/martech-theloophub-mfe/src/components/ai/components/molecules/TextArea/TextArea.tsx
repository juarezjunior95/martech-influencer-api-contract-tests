import {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useState,
} from 'react';

import { cn } from '../../../utils/cn';
import {
  Actions,
  EndContent,
  Inner,
  Root,
  StartContent,
  SubmitButton,
  TextInput,
  TopContent,
} from './TextArea.styles';
import type { TextAreaProps } from './TextArea.types';

const SubmitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z"
      clipRule="evenodd"
    />
  </svg>
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      placeholder = '',
      singleLine = false,
      disabled = false,
      error = false,
      fullWidth = true,
      startContent,
      endContent,
      topContent,
      showSubmit = false,
      onSubmit,
      submitDisabled,
      className,
      onKeyDown,
      onChange,
      value: controlledValue,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(
      defaultValue?.toString() ?? '',
    );

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled
      ? controlledValue.toString()
      : internalValue;
    const hasValue = currentValue.trim().length > 0;

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) {
          setInternalValue(e.target.value);
        }
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const canForceSubmit = submitDisabled === false;
    const handleSubmit = useCallback(() => {
      if (!onSubmit) return;
      if (hasValue || canForceSubmit) {
        onSubmit(currentValue);
      }
    }, [hasValue, currentValue, onSubmit, canForceSubmit]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && onSubmit && hasValue) {
          e.preventDefault();
          handleSubmit();
        }
        onKeyDown?.(e);
      },
      [onSubmit, hasValue, handleSubmit, onKeyDown],
    );

    const showActions = startContent || endContent || showSubmit;

    const disabledMuted = disabled && !topContent;
    const isSubmitDisabled = submitDisabled ?? (disabled || !hasValue);

    return (
      <Root
        className={cn(className)}
        $error={error}
        $fullWidth={fullWidth}
        $disabledMuted={disabledMuted}
        data-error={error ? 'true' : undefined}
        data-single-line={singleLine ? 'true' : undefined}
        data-full-width={fullWidth ? 'true' : undefined}
      >
        <Inner>
          {topContent ? (
            <TopContent>{topContent}</TopContent>
          ) : (
            <TextInput
              ref={ref}
              $singleLine={singleLine}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={error}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              value={isControlled ? controlledValue : undefined}
              defaultValue={isControlled ? undefined : defaultValue}
              rows={singleLine ? 1 : undefined}
              {...props}
            />
          )}
          {showActions && (
            <Actions>
              {startContent && <StartContent>{startContent}</StartContent>}
              <EndContent>
                {endContent}
                {showSubmit && (
                  <SubmitButton
                    type="button"
                    $active={!isSubmitDisabled}
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled}
                    aria-label="Submit"
                  >
                    <SubmitIcon />
                  </SubmitButton>
                )}
              </EndContent>
            </Actions>
          )}
        </Inner>
      </Root>
    );
  },
);

TextArea.displayName = 'TextArea';

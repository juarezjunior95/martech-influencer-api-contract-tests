import { useCallback, useState } from 'react';

import { Button } from '../../atoms/Button';
import { Checkbox } from '../../atoms/Checkbox';
import { Modal } from '../../organisms/Modal';
import {
  BodyContent,
  CharCount,
  CommentsSection,
  CommentsTextarea,
  OptionContent,
  OptionDescription,
  OptionItem,
  OptionLabelText,
  OptionsGrid,
  OtherContent,
  OtherInput,
  OtherInputGroup,
  Subheader,
  SubtitleOptional,
  Title,
} from './FeedbackModal.styles';
import type { FeedbackModalProps } from './FeedbackModal.types';
import {
  COMMENTS_MAX_LENGTH,
  FEEDBACK_OPTIONS,
  OTHER_MAX_LENGTH,
} from './feedbackOptions';

export const FeedbackModal = ({
  open,
  onOpenChange,
  sentiment,
  onSubmit,
}: FeedbackModalProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOtherSelected = selectedOptions.includes('other');
  const config = FEEDBACK_OPTIONS[sentiment];
  const isNegativeWithoutSelection =
    sentiment === 'negative' && selectedOptions.length === 0;
  const isOtherWithoutText = isOtherSelected && !otherText.trim();
  const isSubmitDisabled =
    submitting || isNegativeWithoutSelection || isOtherWithoutText;

  const resetFormState = useCallback(() => {
    setSelectedOptions([]);
    setOtherText('');
    setComments('');
  }, []);

  const handleToggleOption = useCallback((value: string) => {
    setSelectedOptions((prev) => {
      const isDeselecting = prev.includes(value);
      if (isDeselecting && value === 'other') {
        setOtherText('');
      }
      return isDeselecting ? prev.filter((v) => v !== value) : [...prev, value];
    });
  }, []);

  const handleOtherChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length <= OTHER_MAX_LENGTH) {
        setOtherText(value);
      }
    },
    [],
  );

  const handleCommentsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= COMMENTS_MAX_LENGTH) {
        setComments(value);
      }
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const finalOptions = selectedOptions.map((opt) =>
        opt === 'other' && otherText.trim()
          ? `other: ${otherText.trim()}`
          : opt,
      );
      await onSubmit(finalOptions, comments);
      resetFormState();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }, [
    onSubmit,
    selectedOptions,
    otherText,
    comments,
    onOpenChange,
    resetFormState,
  ]);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        resetFormState();
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, resetFormState],
  );

  const renderOptionLabel = (option: {
    value: string;
    label: string;
    description?: string;
  }) => {
    if (option.value === 'other') {
      return (
        <OtherContent>
          <OptionLabelText>{option.label}</OptionLabelText>
          {isOtherSelected && (
            <OtherInputGroup>
              <OtherInput
                value={otherText}
                onChange={handleOtherChange}
                onClick={(e) => e.preventDefault()}
                placeholder="Please tell us"
                maxLength={OTHER_MAX_LENGTH}
                aria-label="Other feedback"
              />
              <CharCount>
                {otherText.length}/{OTHER_MAX_LENGTH}
              </CharCount>
            </OtherInputGroup>
          )}
        </OtherContent>
      );
    }

    return (
      <OptionContent>
        <OptionLabelText>{option.label}</OptionLabelText>
        {option.description && (
          <OptionDescription>{option.description}</OptionDescription>
        )}
      </OptionContent>
    );
  };

  return (
    <Modal open={open} onOpenChange={handleClose} fullscreen={false}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Title>{config.title}</Title>
          <Modal.Close />
        </Modal.Header>

        <Modal.Body>
          <BodyContent>
            <Subheader>
              {config.subtitle}{' '}
              {sentiment === 'positive' && (
                <SubtitleOptional>(optional)</SubtitleOptional>
              )}
            </Subheader>
            <OptionsGrid>
              {config.options.map((option) => (
                <OptionItem key={option.value}>
                  <Checkbox
                    checked={selectedOptions.includes(option.value)}
                    onChange={() => handleToggleOption(option.value)}
                    label={renderOptionLabel(option)}
                    aria-label={option.label}
                  />
                </OptionItem>
              ))}
            </OptionsGrid>

            <CommentsSection>
              <Subheader>
                {config.commentsLabel}{' '}
                <SubtitleOptional>(optional)</SubtitleOptional>
              </Subheader>
              <CommentsTextarea
                placeholder={config.commentsPlaceholder}
                value={comments}
                onChange={handleCommentsChange}
                maxLength={COMMENTS_MAX_LENGTH}
                aria-label="Additional comments"
              />
              <CharCount>
                {comments.length}/{COMMENTS_MAX_LENGTH}
              </CharCount>
            </CommentsSection>
          </BodyContent>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline"
            size="medium"
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

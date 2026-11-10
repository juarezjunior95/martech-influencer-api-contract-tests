import { ChangeEvent, useCallback } from 'react';

import { Button } from '../../atoms/Button';
import { AddCommentAlt } from '../../atoms/Icon';
import { TextArea } from '../TextArea';
import { Container, Disclaimer, HintText } from './BottomBar.styles';
import type { BottomBarProps } from './BottomBar.types';

export const BottomBar = ({
  inputValue,
  onInputChange,
  onSubmit,
  isLoading = false,
  className,
  showDiagnosis = false,
  diagnosisContent,
  smartFlowButton,
  claraDomainDropdown,
  canSubmit,
  isDisabled = false,
  onNewChat,
}: BottomBarProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onInputChange(e.target.value);
    },
    [onInputChange],
  );

  const handleSubmit = useCallback(
    (value: string) => {
      if (canSubmit === false) return;
      if (isLoading) return;

      if (showDiagnosis && canSubmit) {
        onSubmit(value);
        return;
      }

      if (value.trim()) {
        onSubmit(value.trim());
        onInputChange('');
      }
    },
    [isLoading, onSubmit, onInputChange, canSubmit, showDiagnosis],
  );

  if (isDisabled) {
    return (
      <Container className={className}>
        <Button
          variant="secondary"
          size="medium"
          startContent={<AddCommentAlt size={16} />}
          onClick={onNewChat}
        >
          Start new chat
        </Button>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <HintText>
        I can&apos;t see the dashboards. Please mention metrics and filters in
        your question.
      </HintText>
      <TextArea
        value={inputValue}
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder={showDiagnosis ? '' : 'Ask a question'}
        disabled={isLoading}
        showSubmit
        startContent={smartFlowButton}
        topContent={
          showDiagnosis && diagnosisContent ? diagnosisContent : undefined
        }
        submitDisabled={showDiagnosis ? canSubmit === false : undefined}
        endContent={claraDomainDropdown}
      />
      <Disclaimer>
        Clara can make mistakes. Consider checking important information.
      </Disclaimer>
    </Container>
  );
};

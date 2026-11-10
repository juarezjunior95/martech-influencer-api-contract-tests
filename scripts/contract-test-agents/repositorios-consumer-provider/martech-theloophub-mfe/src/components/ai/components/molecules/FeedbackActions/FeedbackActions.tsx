import { CopyButton } from '../../atoms/CopyButton';
import { ThumbDown, ThumbUp } from '../../atoms/Icon';
import { Tooltip } from '../../atoms/Tooltip';
import { Container, FeedbackIconButton } from './FeedbackActions.styles';
import type { FeedbackActionsProps } from './FeedbackActions.types';

export const FeedbackActions = ({
  activeSentiment,
  onThumbUp,
  onThumbDown,
  copyContent,
  className,
}: FeedbackActionsProps) => {
  const isLocked = activeSentiment !== null;

  return (
    <Container className={className}>
      <Tooltip content="Like" hidden={isLocked} position="bottom">
        <FeedbackIconButton
          type="button"
          variant="transparent"
          size="small"
          iconMode
          onClick={onThumbUp}
          disabled={isLocked}
          aria-label="Like"
          aria-pressed={activeSentiment === 'positive'}
          startContent={<ThumbUp filled={activeSentiment === 'positive'} />}
        />
      </Tooltip>

      <Tooltip content="Dislike" hidden={isLocked} position="bottom">
        <FeedbackIconButton
          type="button"
          variant="transparent"
          size="small"
          iconMode
          onClick={onThumbDown}
          disabled={isLocked}
          aria-label="Dislike"
          aria-pressed={activeSentiment === 'negative'}
          startContent={<ThumbDown filled={activeSentiment === 'negative'} />}
        />
      </Tooltip>

      <CopyButton
        content={copyContent}
        iconSize={16}
        ariaLabelCopy="Copy message"
      />
    </Container>
  );
};

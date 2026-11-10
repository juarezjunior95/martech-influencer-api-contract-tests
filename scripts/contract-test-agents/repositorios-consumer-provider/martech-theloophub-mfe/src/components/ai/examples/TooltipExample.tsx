import { Button } from '../components/atoms/Button';
import { CopyButton } from '../components/atoms/CopyButton';
import { AlertCircle, ThumbDown, ThumbUp } from '../components/atoms/Icon';
import { Tooltip } from '../components/atoms/Tooltip';
import {
  AlertIcon,
  FailedBubble,
  MessageRow,
} from '../components/molecules/MessageBubble/MessageBubble.styles';
import { Sandbox } from '../components/organisms/Sandbox';

const COPY_SAMPLE = `# Sample Markdown copied like in chat.`;

const SIDEBAR_TITLE = 'Top 5 Regions in Brazil by ABI Brand Power (2024)';

const LIST_ROW_FULL_TEXT =
  '2023 power by beer brand in South Africa and neighboring markets';

const positionCellStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 152,
  padding: 32,
  boxSizing: 'border-box' as const,
};

const truncatedSpanStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

export const TooltipExample = () => {
  return (
    <Sandbox
      title="Tooltip"
      description="Clara AI chat cases: message actions, copying, truncated text, and positions."
      height={980}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Message actions
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tooltip content="Like" position="bottom">
              <Button
                type="button"
                variant="transparent"
                size="small"
                iconMode
                aria-label="Like"
                startContent={<ThumbUp />}
              />
            </Tooltip>
            <Tooltip content="Dislike" position="bottom">
              <Button
                type="button"
                variant="transparent"
                size="small"
                iconMode
                aria-label="Dislike"
                startContent={<ThumbDown />}
              />
            </Tooltip>
            <CopyButton
              content={COPY_SAMPLE}
              iconSize={16}
              ariaLabelCopy="Copy"
              ariaLabelCopied="Copied"
              tooltipCopyLabel="Copy"
              tooltipCopiedLabel="Copied"
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Sidebar conversation title
          </h4>
          <div style={{ maxWidth: 200 }}>
            <Tooltip content={SIDEBAR_TITLE} position="bottom" fullWidth>
              <span style={truncatedSpanStyle}>{SIDEBAR_TITLE}</span>
            </Tooltip>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Truncated list row
          </h4>
          <div style={{ maxWidth: 140 }}>
            <Tooltip content={LIST_ROW_FULL_TEXT} position="bottom" fullWidth>
              <span style={truncatedSpanStyle}>{LIST_ROW_FULL_TEXT}</span>
            </Tooltip>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Failed message
          </h4>
          <FailedBubble $position="user">
            <MessageRow>
              <span>
                What were the Top 5 regions in Brazil in terms of ABI Brand
                Power in 2024?
              </span>
              <Tooltip
                content="Failed to send. Check your connection and try again."
                position="top"
              >
                <AlertIcon>
                  <AlertCircle size={18} />
                </AlertIcon>
              </Tooltip>
            </MessageRow>
          </FailedBubble>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Positions
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
              maxWidth: 520,
            }}
          >
            <div style={positionCellStyle}>
              <Tooltip content="Tooltip on top" position="top">
                <Button variant="secondary">Top</Button>
              </Tooltip>
            </div>
            <div style={positionCellStyle}>
              <Tooltip content="Tooltip on bottom" position="bottom">
                <Button variant="secondary">Bottom</Button>
              </Tooltip>
            </div>
            <div style={positionCellStyle}>
              <Tooltip content="Tooltip on left" position="left">
                <Button variant="secondary">Left</Button>
              </Tooltip>
            </div>
            <div style={positionCellStyle}>
              <Tooltip content="Tooltip on right" position="right">
                <Button variant="secondary">Right</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Sandbox>
  );
};

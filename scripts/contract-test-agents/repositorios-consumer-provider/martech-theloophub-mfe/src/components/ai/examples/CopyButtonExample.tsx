import { CopyButton } from '../components/atoms/CopyButton';
import { Sandbox } from '../components/organisms/Sandbox';

const SAMPLE_CONTENT = `# Sample Markdown

This is a **sample** content that will be copied to clipboard with rich formatting.

- Item 1
- Item 2
`;

export const CopyButtonExample = () => {
  return (
    <Sandbox title="CopyButton" description="Unified copy-to-clipboard atom">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Default
          </h4>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <CopyButton content={SAMPLE_CONTENT} />
            <span style={{ fontSize: 12, color: '#999' }}>
              Click to copy markdown content
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Small icon
          </h4>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <CopyButton
              content={SAMPLE_CONTENT}
              iconSize={16}
              ariaLabelCopy="Copy message"
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Custom tooltip labels
          </h4>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <CopyButton
              content="Plain text to copy"
              tooltipCopyLabel="Copy to clipboard"
              tooltipCopiedLabel="Done!"
            />
          </div>
        </div>
      </div>
    </Sandbox>
  );
};

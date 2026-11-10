import { BetaTag } from '../components/atoms/BetaTag';
import { Sandbox } from '../components/organisms/Sandbox';

export const BetaTagExample = () => {
  return (
    <Sandbox
      title="BetaTag"
      description="Static visual badge that indicates beta features. Used in ChatHeader to signal that the AI experience is still in development."
      height={250}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: '#666' }}>Uso padrão</span>
          <BetaTag />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: '#666' }}>
            Inline with a title
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 18, color: '#141414' }}>
              Clara Assistant
            </h3>
            <BetaTag />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: '#666' }}>
            In a group of actions (similar to ChatHeader)
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 12px',
              border: '1px solid #E5E5E5',
              borderRadius: 8,
              background: '#FAFAFA',
            }}
          >
            <span style={{ fontSize: 14, color: '#141414' }}>Menu</span>
            <BetaTag />
          </div>
        </div>
      </div>
    </Sandbox>
  );
};

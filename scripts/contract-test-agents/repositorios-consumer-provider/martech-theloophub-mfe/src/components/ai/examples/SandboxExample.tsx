import { Button } from '../components/atoms/Button';
import { Sandbox } from '../components/organisms/Sandbox';

export const SandboxExample = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Sandbox title="Light Background" background="light" height={120}>
        <Button>Button on Light</Button>
      </Sandbox>

      <Sandbox title="Grid Background" background="grid" height={120}>
        <Button>Button on Grid</Button>
      </Sandbox>

      <Sandbox title="Dots Background" background="dots" height={120}>
        <Button>Button on Dots</Button>
      </Sandbox>

      <Sandbox title="Dark Background" background="dark" height={120}>
        <Button variant="primary">Button on Dark</Button>
      </Sandbox>

      <Sandbox
        title="Transparent (Checkerboard)"
        background="transparent"
        height={120}
      >
        <Button>Button on Transparent</Button>
      </Sandbox>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        <Sandbox title="Desktop" device="desktop" height={150}>
          <span style={{ color: '#666', fontSize: 14 }}>100% width</span>
        </Sandbox>

        <Sandbox title="Tablet" device="tablet" height={150}>
          <span style={{ color: '#666', fontSize: 14 }}>max 768px</span>
        </Sandbox>

        <Sandbox title="Mobile" device="mobile" height={150}>
          <span style={{ color: '#666', fontSize: 14 }}>max 375px</span>
        </Sandbox>
      </div>
    </div>
  );
};

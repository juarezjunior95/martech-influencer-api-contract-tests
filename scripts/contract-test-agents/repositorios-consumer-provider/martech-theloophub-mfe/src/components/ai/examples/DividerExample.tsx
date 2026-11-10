import { Divider } from '../components/atoms/Divider';
import { Sandbox } from '../components/organisms/Sandbox';

export const DividerExample = () => {
  return (
    <Sandbox title="Divider" description="Separador horizontal adaptável">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontSize: 14 }}>Content above</p>
        <Divider />
        <p style={{ margin: 0, fontSize: 14 }}>Content below</p>
      </div>
    </Sandbox>
  );
};

import { Button } from '../components/atoms/Button';
import { Sandbox } from '../components/organisms/Sandbox';

export const ButtonExample = () => {
  return (
    <Sandbox title="Button" description="Variantes, tamanhos e estados">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Variants
          </h4>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="action">Action</Button>
            <Button variant="transparent">Transparent</Button>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Sizes
          </h4>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            States
          </h4>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button iconMode startContent={<span>★</span>} />
          </div>
        </div>
      </div>
    </Sandbox>
  );
};

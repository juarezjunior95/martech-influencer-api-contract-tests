import { useState } from 'react';

import { Input } from '../components/atoms/Input';
import { Sandbox } from '../components/organisms/Sandbox';

export const InputExample = () => {
  const [value, setValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  return (
    <Sandbox title="Input" description="Variantes, estados e tipos">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Variants
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              variant="default"
              placeholder="Default input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Input
              variant="rounded"
              placeholder="Rounded input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            States
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input placeholder="Normal state" />
            <Input placeholder="With error" hasError />
            <Input placeholder="Disabled state" disabled />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Types
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input type="text" placeholder="Text input" />
            <Input
              type="email"
              placeholder="Email input"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <Input type="password" placeholder="Password input" />
            <Input type="search" placeholder="Search input" variant="rounded" />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Width
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input placeholder="Default width" />
            <Input placeholder="Full width" fullWidth />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Controlled Input
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input
              placeholder="Digite algo..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
            />
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
              Valor: {value || '(vazio)'}
            </p>
          </div>
        </div>
      </div>
    </Sandbox>
  );
};

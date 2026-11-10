import { useState } from 'react';

import { Checkbox } from '../components/atoms/Checkbox';
import { Sandbox } from '../components/organisms/Sandbox';

export const CheckboxExample = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);

  return (
    <Sandbox title="Checkbox" description="Estados e variações do checkbox">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            States
          </h4>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Checkbox
              checked={checked1}
              onChange={(e) => setChecked1(e.target.checked)}
              label="Unchecked"
            />
            <Checkbox
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
              label="Checked"
            />
            <Checkbox checked={false} disabled label="Disabled" />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Without label
          </h4>
          <div style={{ display: 'flex', gap: 24 }}>
            <Checkbox
              checked={checked3}
              onChange={(e) => setChecked3(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </Sandbox>
  );
};

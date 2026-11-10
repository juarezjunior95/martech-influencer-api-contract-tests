import { useState } from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../components/organisms/Drawer';
import { Sandbox } from '../components/organisms/Sandbox';
import { MockAppLayout, PropsTable } from './components';

const DRAWER_PROPS = [
  { name: 'open', type: 'boolean', description: 'Estado aberto/fechado' },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Callback de mudança',
  },
];

const DRAWER_CONTENT_PROPS = [
  {
    name: 'width',
    type: 'number',
    default: '420',
    description: 'Largura do drawer',
  },
  {
    name: 'showOverlay',
    type: 'boolean',
    default: 'true',
    description: 'Mostra overlay',
  },
  {
    name: 'contained',
    type: 'boolean',
    default: 'false',
    description: 'Modo sandbox',
  },
];

const DRAWER_TRIGGER_PROPS = [
  {
    name: 'top',
    type: 'number',
    default: '64',
    description: 'Posição vertical',
  },
  { name: 'children', type: 'ReactNode', description: 'Texto do botão' },
];

export const DrawerExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Sandbox
        title="Drawer"
        description="Painel lateral deslizante com trigger vertical"
        background="dots"
        height={500}
        padding={0}
      >
        <MockAppLayout />

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent showOverlay={false} contained>
            <DrawerTrigger top={80}>Ask One Way AI</DrawerTrigger>
            <DrawerHeader>
              <DrawerTitle>Chat with AI</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <DrawerBody>
              <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
                Drawer content goes here.
              </p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Sandbox>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            Drawer
          </h4>
          <PropsTable props={DRAWER_PROPS} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            DrawerContent
          </h4>
          <PropsTable props={DRAWER_CONTENT_PROPS} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 12, color: '#666' }}>
            DrawerTrigger
          </h4>
          <PropsTable props={DRAWER_TRIGGER_PROPS} />
        </div>
      </div>
    </div>
  );
};

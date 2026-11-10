import { TextArea } from '../components/molecules/TextArea';
import { Sandbox } from '../components/organisms/Sandbox';
import { PropsTable } from './components';

const TEXT_AREA_PROPS = [
  { name: 'placeholder', type: 'string', description: 'Texto placeholder' },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Desabilita o campo',
  },
  {
    name: 'showSubmit',
    type: 'boolean',
    default: 'false',
    description: 'Mostra botão de submit',
  },
  {
    name: 'onSubmit',
    type: '(value: string) => void',
    description: 'Callback ao submeter',
  },
  {
    name: 'singleLine',
    type: 'boolean',
    default: 'false',
    description: 'Modo linha única',
  },
];

export const TextAreaExample = () => {
  return (
    <Sandbox
      title="TextArea"
      description="Campo de texto com botão de submit"
      height={260}
    >
      <div
        style={{
          display: 'flex',
          gap: 24,
          width: '100%',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: '0 0 400px' }}>
          <TextArea
            placeholder="Ask a follow up question..."
            showSubmit
            onSubmit={(value) => alert(`Submitted: ${value}`)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <PropsTable props={TEXT_AREA_PROPS} />
        </div>
      </div>
    </Sandbox>
  );
};

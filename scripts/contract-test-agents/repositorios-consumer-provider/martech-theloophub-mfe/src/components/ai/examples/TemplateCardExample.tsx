import { TemplateCard } from '../components/molecules/TemplateCard';
import { Sandbox } from '../components/organisms/Sandbox';
import { PropsTable } from './components';

const TEMPLATE_CARD_PROPS = [
  { name: 'title', type: 'string', description: 'Título do card (opcional)' },
  { name: 'description', type: 'string', description: 'Descrição do template' },
  { name: 'onClick', type: '() => void', description: 'Callback ao clicar' },
];

export const TemplateCardExample = () => {
  return (
    <Sandbox
      title="TemplateCard"
      description="Cards clicáveis para templates e sugestões"
      height={340}
    >
      <div style={{ display: 'flex', gap: 24, width: '100%' }}>
        <div
          style={{
            flex: '0 0 380px',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <TemplateCard
              title="Brand KPI Trend"
              description='Eg. "How did Corona perform from 2022 to 2024?"'
              onClick={() => alert('Template clicked')}
            />
            <TemplateCard
              title="KPI Root Cause"
              description='Eg. "Why did brand power change?"'
              onClick={() => alert('Template clicked')}
            />
            <TemplateCard
              description="Why did the brand power of Budweiser change?"
              onClick={() => alert('Suggestion clicked')}
            />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <PropsTable props={TEMPLATE_CARD_PROPS} />
        </div>
      </div>
    </Sandbox>
  );
};

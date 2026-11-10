import { Loader } from '../components/atoms/Loader';
import { Sandbox } from '../components/organisms/Sandbox';

export const LoaderExample = () => {
  return (
    <Sandbox
      title="Loader"
      description="Indicador de loading animado"
      height={200}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#666',
            }}
          >
            xs: <Loader size="xs" />
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#666',
            }}
          >
            sm: <Loader size="sm" />
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#666',
            }}
          >
            md: <Loader size="md" />
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#666',
            }}
          >
            lg: <Loader size="lg" />
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#666',
            fontSize: 14,
          }}
        >
          Thinking <Loader size="sm" />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#666',
            fontSize: 14,
          }}
        >
          <Loader variant="spinner" size="sm" />
        </div>
      </div>
    </Sandbox>
  );
};

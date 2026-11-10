import type { ReactNode } from 'react';

interface MockAppLayoutProps {
  children?: ReactNode;
}

export const MockAppLayout = ({ children }: MockAppLayoutProps) => {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#f7f7f7' }}>
      <header
        style={{
          height: 56,
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            width: 100,
            height: 28,
            background: 'linear-gradient(90deg, #e5b611, #d3a238)',
            borderRadius: 4,
          }}
        />
        <nav style={{ display: 'flex', gap: 16 }}>
          <span
            style={{
              width: 60,
              height: 12,
              background: '#ddd',
              borderRadius: 4,
            }}
          />
          <span
            style={{
              width: 60,
              height: 12,
              background: '#ddd',
              borderRadius: 4,
            }}
          />
        </nav>
      </header>

      <main
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        <div
          style={{
            height: 120,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
          }}
        />
        <div
          style={{
            height: 120,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
          }}
        />
        <div
          style={{
            height: 120,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
          }}
        />
      </main>

      {children}
    </div>
  );
};

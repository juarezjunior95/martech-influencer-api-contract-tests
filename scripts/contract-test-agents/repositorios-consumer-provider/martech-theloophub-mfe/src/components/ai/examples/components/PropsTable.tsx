import type { CSSProperties } from 'react';

interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

interface PropsTableProps {
  props: PropDefinition[];
}

const styles: Record<string, CSSProperties> = {
  container: {},
  title: {
    margin: '0 0 12px',
    fontSize: 12,
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    background: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
    fontWeight: 600,
    color: '#333',
  },
  td: {
    padding: '8px 12px',
    borderBottom: '1px solid #f0f0f0',
    verticalAlign: 'top',
  },
  propName: {
    fontFamily: 'monospace',
    color: '#d63384',
    fontWeight: 500,
  },
  propType: {
    fontFamily: 'monospace',
    color: '#0d6efd',
    fontSize: 11,
  },
  propDefault: {
    fontFamily: 'monospace',
    color: '#198754',
    fontSize: 11,
  },
  propDesc: {
    color: '#666',
  },
};

export const PropsTable = ({ props }: PropsTableProps) => {
  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Props</h4>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Prop</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Default</th>
            <th style={styles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td style={styles.td}>
                <span style={styles.propName}>{prop.name}</span>
              </td>
              <td style={styles.td}>
                <span style={styles.propType}>{prop.type}</span>
              </td>
              <td style={styles.td}>
                <span style={styles.propDefault}>{prop.default || '-'}</span>
              </td>
              <td style={styles.td}>
                <span style={styles.propDesc}>{prop.description || '-'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

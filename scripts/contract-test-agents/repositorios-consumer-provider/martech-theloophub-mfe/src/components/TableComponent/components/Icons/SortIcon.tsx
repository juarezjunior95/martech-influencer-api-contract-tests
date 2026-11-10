import React from 'react';

import { SortDefault } from '@hexa-ui/icons2';

interface SortIconProps {
  direction?: 'asc' | 'desc' | 'none';
}

export const SortIcon: React.FC<SortIconProps> = ({ direction = 'none' }) => {
  const getRotation = () => {
    if (direction === 'asc') return 'rotate(180deg)';
    if (direction === 'desc') return 'rotate(0deg)';
    return 'rotate(0deg)';
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        transform: getRotation(),
        transition: 'transform 0.2s ease',
        width: 16,
        height: 16,
      }}
    >
      <SortDefault />
    </span>
  );
};

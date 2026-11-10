import React from 'react';

export interface IChartHeaderProps {
  title: string;
  measure?: string;
  info?: React.ReactNode;
  period?: string;
  description?: string;
  actions?: Array<React.ReactNode>;
  config?: {
    float?: boolean;
    inline?: 'horizontal' | 'vertical' | 'none';
    type?: 'xxsmall' | 'small' | 'large';
    alignment?: 'left' | 'center';
    periodPosition?: 'default' | 'top-right';
    tooltipPosition?: 'default' | 'float';
  };

  tooltipSize?: 'small' | 'medium' | 'large';
  dataTestId?: string;
}

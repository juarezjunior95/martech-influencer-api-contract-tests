import { useMemo } from 'react';

import { StripedPatternParams } from 'models/ChartData';

import { StyledStripedBackground } from './StripedBackground.styles';

interface StripedBackgroundProps {
  params: StripedPatternParams;
  backgroundColor: string;
}

export const StripedBackground = ({
  params,
  backgroundColor,
}: StripedBackgroundProps): JSX.Element => {
  const background = useMemo(() => {
    return `repeating-linear-gradient(
        ${params.angle}deg,
        ${params.color},
        ${params.color} 3px,
        ${backgroundColor} 3px,
        ${backgroundColor} 7px
      )`;
  }, [params, backgroundColor]);

  return (
    <StyledStripedBackground
      style={{ background, border: `1px solid ${backgroundColor}` }}
    ></StyledStripedBackground>
  );
};

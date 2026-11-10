import { useRef } from 'react';

import {
  StyledSliderRange,
  StyledSliderRoot,
  StyledSliderThumb,
  StyledSliderTrack,
} from './CustomSlider.styles';

type CustomSliderType = 'range' | 'fixedRange' | 'slider';

export interface CustomSliderProps {
  type?: CustomSliderType;
  min: number;
  max: number;
  maxInput: number;
  value: number[];
  callback: (values: number[]) => void;
  dataTestId?: string;
}

export const CustomSlider = ({
  type,
  min,
  max,
  maxInput,
  value,
  callback,
  dataTestId,
}: CustomSliderProps): JSX.Element => {
  const sliderRootRef = useRef(null);

  const shouldRenderRange = type !== 'slider';
  const firstThumbVisible = type === 'range';

  const percentage = (maxInput / max) * 100 + '%';

  return (
    <StyledSliderRoot
      ref={sliderRootRef}
      min={min}
      max={max}
      value={value}
      onValueChange={callback}
      data-testid={dataTestId}
    >
      <StyledSliderTrack
        style={{
          background: `linear-gradient(to right, #b4cee9 0 ${percentage}, #ededed 0)`,
        }}
        data-testid={dataTestId ? `${dataTestId}-track` : undefined}
      >
        {shouldRenderRange && <StyledSliderRange />}
      </StyledSliderTrack>
      <StyledSliderThumb visible={firstThumbVisible} aria-label="first-value" />
      <StyledSliderThumb aria-label="last-value" />
    </StyledSliderRoot>
  );
};

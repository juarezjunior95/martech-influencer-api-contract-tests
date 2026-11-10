import { styled } from '@hexa-ui/theme';
import * as Slider from '@radix-ui/react-slider';

export const StyledSliderRoot = styled(Slider.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: '100%',
  height: '8px',
  borderRadius: '64px',
});

export const StyledSliderTrack = styled(Slider.Track, {
  position: 'relative',
  flexGrow: 1,
  borderRadius: '9999px',
  height: '8px',
});

export const StyledSliderRange = styled(Slider.Range, {
  position: 'absolute',
  background: '#006EDB',
  borderRadius: '9999px',
  height: '100%',
});

export const StyledSliderThumb = styled(Slider.Thumb, {
  display: 'block',
  width: '16px',
  height: '16px',
  background: '#006EDB',
  boxShadow: '0 1px 5px black',
  borderRadius: '50%',
  border: '2px solid white',
  outline: 'none',
  cursor: 'pointer',

  '&:hover': {
    transform: 'scale(1.2)',
    background: '#006EDB',
    border: '2px solid white',
  },

  '&:active': {
    background: '#006EDB',
    transform: 'scale(1.2)',
    border: '2px solid white',
  },

  '&:focus-visible': {
    background: '#006EDB',
    border: '2px solid white',
  },

  variants: {
    visible: {
      true: {},
      false: { visibility: 'hidden' },
    },
  },
});

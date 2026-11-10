import { Fragment, useEffect, useRef, useState } from 'react';

import type { CustomTooltipProps } from 'ag-grid-react';
import { HeaderContent } from 'components/HeaderContent';
import { useGoogleAnalytics } from 'hooks';

import { StyledCustomAgGridTooltip } from './CustomAgGridTooltip.styles';

type TooltipProperties = {
  position: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
  left: number;
  top: number;
};

export const CustomAgGridTooltip: React.FC<CustomTooltipProps> = (
  props: CustomTooltipProps,
) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const trackGA = useGoogleAnalytics();
  const [properties, setProperties] = useState<TooltipProperties>({
    position: 'relative',
    left: 0,
    top: 0,
  });
  const colDef = props.column?.getDefinition() as any;
  const componentParams = {
    ...colDef?.headerComponentParams,
    ...colDef?.headerGroupComponentParams,
  };
  const style =
    props.location === 'header'
      ? componentParams?.tooltipHeaderStyle
      : componentParams?.tooltipCellStyle;

  const handleOpenTooltip = (label: string) => {
    if (!label) return;

    try {
      trackGA({
        event_category: 'Tooltip',
        event_action: 'Opened',
        event_label: label,
      });
    } catch (error) {
      console.error('Failed to track Google Analytics event:', error);
    }
  };

  useEffect(() => {
    if (tooltipRef.current && props.api) {
      const tooltipElement = tooltipRef.current;
      const tooltipRect = tooltipElement.getBoundingClientRect();

      if (props.data) {
        handleOpenTooltip(props.data?.portfolio);
      } else if (props.colDef) {
        handleOpenTooltip(props.colDef?.headerName);
      }

      setProperties({
        left: tooltipRect.x,
        top: tooltipRect.y,
        position: 'fixed',
      });
    }
  }, [props]);

  const processedTooltipValue =
    typeof props.value === 'string'
      ? props.value
          .split('.')
          .filter((val) => val.trim())
          .map((val) => val.trim() + '.')
          .join('\n')
      : props.value;

  return (
    <StyledCustomAgGridTooltip
      darkMode={style === 'dark'}
      ref={tooltipRef}
      style={{
        left: `${properties.left}px`,
        top: `${properties.top}px`,
        position: properties.position,
        whiteSpace: 'pre-line',
      }}
    >
      <HeaderContent
        items={[
          {
            content: [
              <Fragment key="tooltip">{processedTooltipValue}</Fragment>,
            ],
          },
        ]}
      />
    </StyledCustomAgGridTooltip>
  );
};

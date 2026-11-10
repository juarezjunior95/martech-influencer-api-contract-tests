import { useCallback, useRef, useState } from 'react';

import type { SmartFlowConfig } from 'models/InsightsCopilot';

import { BottomSheet } from '../../atoms/BottomSheet';
import { TemplateCard } from '../../molecules/TemplateCard';
import { OverlayTitle } from './SmartFlowOverlay.styles';

export interface SmartFlowOverlayProps {
  smartFlows: SmartFlowConfig[];
  onSelect: (flow: SmartFlowConfig) => void;
  onClose: () => void;
  container?: HTMLElement;
}

export const SmartFlowOverlay = ({
  smartFlows,
  onSelect,
  onClose,
  container,
}: SmartFlowOverlayProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const pendingFlowRef = useRef<SmartFlowConfig | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (!isClosing) return;
    if (pendingFlowRef.current) {
      onSelect(pendingFlowRef.current);
      pendingFlowRef.current = null;
    } else {
      onClose();
    }
  }, [isClosing, onSelect, onClose]);

  const handleSelect = useCallback((flow: SmartFlowConfig) => {
    pendingFlowRef.current = flow;
    setIsClosing(true);
  }, []);

  return (
    <BottomSheet
      isClosing={isClosing}
      onCloseClick={handleClose}
      onAnimationEnd={handleAnimationEnd}
      title={<OverlayTitle>Get Started with Smart Flows</OverlayTitle>}
      container={container}
      ariaLabel="Smart Flows"
    >
      {smartFlows.map((flow) => (
        <TemplateCard
          key={flow.id}
          title={flow.title}
          description={flow.example_query || flow.query}
          variant="clean"
          onClick={() => handleSelect(flow)}
        />
      ))}
    </BottomSheet>
  );
};

import { useCallback, useEffect, useRef, useState } from 'react';

import { Check, Domain } from '../../atoms/Icon';
import {
  CheckSlot,
  Chevron,
  Container,
  Menu,
  Option,
  OptionContent,
  OptionDescription,
  OptionTitle,
  Trigger,
  TriggerLabel,
} from './ClaraDomainDropdown.styles';

export interface ClaraDomainOption {
  label: string;
  value: string;
  description: string;
}

export interface ClaraDomainDropdownProps {
  options: ClaraDomainOption[];
  selected: ClaraDomainOption;
  onChange: (option: ClaraDomainOption) => void;
  disabled?: boolean;
}

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ClaraDomainDropdown = ({
  options,
  selected,
  onChange,
  disabled = false,
}: ClaraDomainDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close, isOpen]);

  const handleSelect = useCallback(
    (option: ClaraDomainOption) => {
      onChange(option);
      close();
    },
    [close, onChange],
  );

  return (
    <Container ref={containerRef}>
      <Trigger
        type="button"
        isOpen={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select Clara AI insight source"
      >
        <Domain size={16} color="#141414" />
        <TriggerLabel>{selected.label}</TriggerLabel>
        <Chevron isOpen={isOpen}>
          <ChevronDown />
        </Chevron>
      </Trigger>

      {isOpen && (
        <Menu role="listbox" aria-label="Clara AI insight sources">
          {options.map((option) => {
            const isSelected = option.value === selected.value;

            return (
              <Option
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                isSelected={isSelected}
                onClick={() => handleSelect(option)}
              >
                <OptionContent>
                  <OptionTitle>{option.label}</OptionTitle>
                  <OptionDescription>{option.description}</OptionDescription>
                </OptionContent>
                <CheckSlot>{isSelected && <Check size={14} />}</CheckSlot>
              </Option>
            );
          })}
        </Menu>
      )}
    </Container>
  );
};

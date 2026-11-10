import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { LabelValuePair } from 'models/InsightsCopilot';

import { Check, Close } from '../Icon';
import { Loader } from '../Loader';
import {
  ChevronIcon,
  ClearButton,
  CloseDropdownButton,
  Dropdown,
  DropdownHeader,
  LoadingContainer,
  NoResults,
  OptionItem,
  OptionsList,
  RequiredMark,
  SearchInput,
  SearchWrapper,
  SelectContainer,
  Trigger,
} from './Select.styles';

export interface SelectProps {
  options: LabelValuePair[];
  selected: LabelValuePair[];
  onChange: (values: LabelValuePair[]) => void;
  placeholder?: string;
  required?: boolean;
  allowMultiSelect?: boolean;
  loading?: boolean;
  searchable?: boolean;
  dropDirection?: 'up' | 'down';
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

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M12.3535 7.62695C12.3535 5.01654 10.2374 2.90039 7.62695 2.90039C5.01657 2.90045 2.90045 5.01657 2.90039 7.62695C2.90039 10.2374 5.01654 12.3535 7.62695 12.3535C10.2374 12.3535 12.3535 10.2374 12.3535 7.62695ZM13.3535 7.62695C13.3535 9.04454 12.8369 10.3405 11.9837 11.3405L13.9479 13.2409L13.9831 13.2786C14.1463 13.4724 14.1396 13.7619 13.9596 13.9479C13.7796 14.134 13.49 14.1505 13.291 13.9935L13.2526 13.9596L11.2721 12.0436C10.2819 12.8619 9.01187 13.3535 7.62695 13.3535C4.46425 13.3535 1.90039 10.7897 1.90039 7.62695C1.90045 4.46428 4.46428 1.90045 7.62695 1.90039C10.7897 1.90039 13.3535 4.46425 13.3535 7.62695Z"
      fill="currentColor"
    />
  </svg>
);

export const Select = ({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  required = false,
  allowMultiSelect = false,
  loading = false,
  searchable = false,
  dropDirection = 'up',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownAlign, setDropdownAlign] = useState<'left' | 'right'>('left');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedValues = useMemo(
    () => new Set(selected.map((s) => s.value)),
    [selected],
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const lower = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, search]);

  const displayText = useMemo(() => {
    if (selected.length === 0) return '';
    return selected.map((s) => s.label).join(', ');
  }, [selected]);

  useLayoutEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const wouldOverflowRight = rect.left + 200 > window.innerWidth;
      setDropdownAlign(wouldOverflowRight ? 'right' : 'left');
    }
  }, [isOpen, selected]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setSearch('');
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch('');
  }, []);

  const handleClear = useCallback(() => {
    onChange([]);
  }, [onChange]);

  const handleSelect = useCallback(
    (option: LabelValuePair) => {
      if (allowMultiSelect) {
        const isSelected = selectedValues.has(option.value);
        if (isSelected) {
          onChange(selected.filter((s) => s.value !== option.value));
        } else {
          onChange([...selected, option]);
        }
      } else {
        onChange([option]);
        setIsOpen(false);
      }
    },
    [allowMultiSelect, selected, selectedValues, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const renderOptions = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <Loader size="sm" />
        </LoadingContainer>
      );
    }

    if (filteredOptions.length === 0) {
      return <NoResults>No results found</NoResults>;
    }

    return (
      <OptionsList>
        {filteredOptions.map((option) => {
          const isSelected = selectedValues.has(option.value);
          return (
            <OptionItem
              key={option.value}
              isSelected={isSelected}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={isSelected}
            >
              {option.label}
              {isSelected && <Check size={14} />}
            </OptionItem>
          );
        })}
      </OptionsList>
    );
  };

  return (
    <SelectContainer ref={containerRef}>
      <Trigger
        type="button"
        onClick={handleToggle}
        hasValue={selected.length > 0}
        isRequired={required}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {displayText || placeholder}
        {required && !displayText && <RequiredMark>*</RequiredMark>}
        <ChevronIcon isOpen={isOpen}>
          <ChevronDown />
        </ChevronIcon>
      </Trigger>

      {isOpen && (
        <Dropdown
          role="listbox"
          align={dropdownAlign}
          dropDirection={dropDirection}
        >
          <DropdownHeader>
            <ClearButton type="button" onClick={handleClear}>
              Clear
            </ClearButton>
            <CloseDropdownButton
              type="button"
              onClick={handleClose}
              aria-label="Close dropdown"
            >
              <Close size={14} />
            </CloseDropdownButton>
          </DropdownHeader>

          {searchable && (
            <SearchWrapper>
              <SearchIcon />
              <SearchInput
                ref={searchRef}
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search options"
              />
            </SearchWrapper>
          )}

          {renderOptions()}
        </Dropdown>
      )}
    </SelectContainer>
  );
};

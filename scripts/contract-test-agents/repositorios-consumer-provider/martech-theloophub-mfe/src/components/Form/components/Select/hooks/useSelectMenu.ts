import { useEffect, useMemo, useRef, useState } from 'react';

import { Option } from 'models/Filters';

import { isTargetInsideSelect } from '../utils';

interface UseSelectMenuParams {
  id: string;
  value: string | string[] | Option | Option[] | number | undefined;
  flatOptions: Option[];
}

interface UseSelectMenuReturn {
  menuIsOpen: boolean | undefined;
  setMenuIsOpen: (value: boolean) => void;
  selectRef: React.RefObject<HTMLDivElement>;
  isMouseOverSearchRef: React.MutableRefObject<boolean>;
  menuListScrollRef: React.MutableRefObject<number>;
  allSelected: boolean;
  someValueSelected: boolean;
}

export const useSelectMenu = ({
  id,
  value,
  flatOptions,
}: UseSelectMenuParams): UseSelectMenuReturn => {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean | undefined>(undefined);
  const selectRef = useRef<HTMLDivElement>(null);
  const isMouseOverSearchRef = useRef<boolean>(false);
  const menuListScrollRef = useRef<number>(0);

  const allSelected = useMemo(() => {
    const currentValues = Array.isArray(value) ? value : [];
    const currentValueStrings = new Set(
      currentValues.map((v) => (typeof v === 'string' ? v : v.value)),
    );

    const allFlatValues = flatOptions
      .filter((opt) => !opt.isDisabled)
      .map((opt) => opt.value);

    return allFlatValues.every((val) => currentValueStrings.has(val));
  }, [value, flatOptions]);

  const someValueSelected = useMemo(() => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return !!value;
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuIsOpen !== true) return;

      const target = event.target as Element;

      if (isTargetInsideSelect(target, selectRef, id)) {
        return;
      }

      setMenuIsOpen(false);
    };

    const handleScroll = () => {
      setMenuIsOpen(false);
    };

    if (menuIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [id, menuIsOpen]);

  return {
    menuIsOpen,
    setMenuIsOpen,
    selectRef,
    isMouseOverSearchRef,
    menuListScrollRef,
    allSelected,
    someValueSelected,
  };
};

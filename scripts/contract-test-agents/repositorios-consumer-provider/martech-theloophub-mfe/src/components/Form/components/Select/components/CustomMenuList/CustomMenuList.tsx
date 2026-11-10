import { useCallback, useEffect, useRef, useState } from 'react';
import { components, MenuListProps } from 'react-select';

import { Icon } from '@hexa-ui/components2';
import { Search } from '@hexa-ui/icons2';

import { StyledSearchOption } from './CustomMenuList.styles';

interface CustomMenuListProps extends MenuListProps {
  searchable?: boolean;
  isMouseOverSearchRef?: React.MutableRefObject<boolean>;
  menuListScrollRef?: React.MutableRefObject<number>;
}

export const CustomMenuList = (props: CustomMenuListProps) => {
  const {
    children,
    searchable,
    isMouseOverSearchRef,
    menuListScrollRef,
    selectProps,
  } = props;
  const [isInputFocused, setIsInputFocused] = useState(false);
  const menuListRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { dataTestId } = selectProps as { dataTestId?: string };

  const saveScrollPosition = useCallback(() => {
    if (menuListRef.current && menuListScrollRef) {
      menuListScrollRef.current = menuListRef.current.scrollTop;
    }
  }, [menuListScrollRef]);

  const restoreScrollPosition = useCallback(() => {
    if (menuListRef.current && menuListScrollRef) {
      menuListRef.current.scrollTop = menuListScrollRef.current;
    }
  }, [menuListScrollRef]);

  useEffect(() => {
    const menuListElement = menuListRef.current;
    if (!menuListElement) return;

    restoreScrollPosition();

    menuListElement.addEventListener('scroll', saveScrollPosition);

    return () => {
      menuListElement.removeEventListener('scroll', saveScrollPosition);
    };
  }, [children, saveScrollPosition, restoreScrollPosition]);

  if (!searchable) {
    return (
      <components.MenuList
        {...props}
        innerRef={menuListRef}
        data-testid={dataTestId ? `${dataTestId}-menu-list` : undefined}
      >
        {children}
      </components.MenuList>
    );
  }

  const handleSearchClick = (e: React.MouseEvent) => {
    setIsInputFocused(true);
    searchInputRef.current?.focus();
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSearchMouseDown = (e: React.MouseEvent) => {
    setIsInputFocused(true);
    e.stopPropagation();
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    setIsInputFocused(true);
    e.stopPropagation();
  };

  const handleMouseEnter = () => {
    if (isMouseOverSearchRef) {
      isMouseOverSearchRef.current = true;
    }
  };

  const handleMouseLeave = () => {
    if (isMouseOverSearchRef) {
      isMouseOverSearchRef.current = false;
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <components.MenuList
      {...props}
      innerRef={menuListRef}
      data-testid={dataTestId ? `${dataTestId}-menu-list` : undefined}
    >
      <StyledSearchOption
        onClick={handleSearchClick}
        onMouseDown={handleSearchMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isInputFocused={isInputFocused}
        data-testid={dataTestId ? `${dataTestId}-search-container` : undefined}
      >
        <Icon icon={Search} />
        <input
          ref={searchInputRef}
          type="text"
          name="react-select-search"
          placeholder="Search"
          value={selectProps.inputValue}
          onChange={(e) => {
            selectProps.onInputChange(e.target.value, {
              action: 'input-change',
              prevInputValue: selectProps.inputValue,
            });
          }}
          onClick={handleSearchClick}
          onMouseDown={handleSearchMouseDown}
          onKeyDown={handleSearchKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: '14px',
            fontFamily: 'Work Sans',
            color: '#141414',
            padding: 0,
          }}
          data-testid={dataTestId ? `${dataTestId}-search-input` : undefined}
        />
      </StyledSearchOption>
      {children}
    </components.MenuList>
  );
};

import { createCustomStyles } from './customStyles';

describe('createCustomStyles', () => {
  const mockProvided = { color: 'initial' };
  const mockState = {
    isFocused: false,
    isSelected: false,
    isDisabled: false,
    isMulti: false,
  };

  describe('container styles', () => {
    it('should have width 100%', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const containerStyles = styles.container?.(
        mockProvided as any,
        {} as any,
      );
      expect(containerStyles).toHaveProperty('width', '100%');
    });
  });

  describe('control styles', () => {
    it('should have default background color when not disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('backgroundColor', '#ffffff');
    });

    it('should have disabled background color when disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: true,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('backgroundColor', '#14141414');
    });

    it('should have error border when hasError is true', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: true,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('border', '1px solid #e82727');
    });

    it('should have focused border when isFocused is true', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const focusedState = { ...mockState, isFocused: true };
      const controlStyles = styles.control?.(
        mockProvided as any,
        focusedState as any,
      );
      expect(controlStyles).toHaveProperty('border', '1px solid #1414141f');
    });

    it('should have default border when not focused and no error', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('border', '1px solid #1414141f');
    });

    it('should have pill border radius when shape is pill', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'pill',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('borderRadius', '24px');
    });

    it('should have square border radius when shape is square', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('borderRadius', '8px');
    });

    it('should have not-allowed cursor when disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: true,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('cursor', 'not-allowed');
    });

    it('should have pointer cursor when not disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('cursor', 'pointer');
    });

    it('should have disabled color when disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: true,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('color', '#14141452');
    });
  });

  describe('appearance plain', () => {
    it('should have transparent background', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'plain',
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('backgroundColor', 'transparent');
    });

    it('should have no border', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'plain',
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles?.border).toContain('none');
    });

    it('should have auto minHeight', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'plain',
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('minHeight', 'auto');
    });

    it('should have plain color', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'plain',
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('color', '#1414148f');
    });
  });

  describe('size styles', () => {
    it('should have small height for small size', () => {
      const styles = createCustomStyles({
        size: 'small',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('minHeight', '32px');
    });

    it('should have medium height for medium size', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('minHeight', '40px');
    });

    it('should have large height for large size', () => {
      const styles = createCustomStyles({
        size: 'large',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('minHeight', '48px');
    });

    it('should have correct font size for small', () => {
      const styles = createCustomStyles({
        size: 'small',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('fontSize', '14px');
    });

    it('should have correct font size for medium', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('fontSize', '16px');
    });

    it('should have correct font size for large', () => {
      const styles = createCustomStyles({
        size: 'large',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const controlStyles = styles.control?.(
        mockProvided as any,
        mockState as any,
      );
      expect(controlStyles).toHaveProperty('fontSize', '16px');
    });
  });

  describe('placeholder styles', () => {
    it('should hide placeholder when isMulti is true', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'default',
        placeholder: 'Select...',
      });

      const multiState = { ...mockState, isMulti: true };
      const placeholderStyles = styles.placeholder?.(
        mockProvided as any,
        multiState as any,
      );
      expect(placeholderStyles).toHaveProperty('display', 'none');
    });

    it('should hide placeholder when placeholder is empty', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'default',
        placeholder: '',
      });

      const placeholderStyles = styles.placeholder?.(
        mockProvided as any,
        mockState as any,
      );
      expect(placeholderStyles).toHaveProperty('display', 'none');
    });

    it('should show placeholder when single select and placeholder exists', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'default',
        placeholder: 'Select...',
      });

      const placeholderStyles = styles.placeholder?.(
        mockProvided as any,
        mockState as any,
      );
      expect(placeholderStyles).toHaveProperty('display', 'block');
    });
  });

  describe('multiValue styles', () => {
    it('should display flex when chips is true', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        chips: true,
      });

      const multiValueStyles = styles.multiValue?.(
        mockProvided as any,
        {} as any,
      );
      expect(multiValueStyles).toHaveProperty('display', 'flex');
    });

    it('should display none when chips is false', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        chips: false,
      });

      const multiValueStyles = styles.multiValue?.(
        mockProvided as any,
        {} as any,
      );
      expect(multiValueStyles).toHaveProperty('display', 'none');
    });

    it('should have disabled color when disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: true,
        hasError: false,
        chips: true,
      });

      const multiValueStyles = styles.multiValue?.(
        mockProvided as any,
        {} as any,
      );
      expect(multiValueStyles).toHaveProperty('color', '#1414145c');
    });
  });

  describe('singleValue styles', () => {
    it('should have disabled color when disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: true,
        hasError: false,
      });

      const singleValueStyles = styles.singleValue?.(
        mockProvided as any,
        {} as any,
      );
      expect(singleValueStyles).toHaveProperty('color', '#14141452');
    });

    it('should have normal color when not disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const singleValueStyles = styles.singleValue?.(
        mockProvided as any,
        {} as any,
      );
      expect(singleValueStyles).toHaveProperty('color', '#141414');
    });
  });

  describe('option styles', () => {
    it('should have selected background when isSelected', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const selectedState = { ...mockState, isSelected: true };
      const optionStyles = styles.option?.(
        mockProvided as any,
        selectedState as any,
      );
      expect(optionStyles).toHaveProperty('backgroundColor', '#fff1c2');
    });

    it('should have selected background when allSelected is true', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        appearance: 'default',
        allSelected: true,
      });

      const optionStyles = styles.option?.(
        mockProvided as any,
        mockState as any,
      );
      expect(optionStyles).toHaveProperty('backgroundColor', '#fff1c2');
    });

    it('should have focused background when isFocused and not disabled', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const focusedState = { ...mockState, isFocused: true };
      const optionStyles = styles.option?.(
        mockProvided as any,
        focusedState as any,
      );
      expect(optionStyles).toHaveProperty('backgroundColor', '#ffffff');
    });

    it('should have white background when default state', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const optionStyles = styles.option?.(
        mockProvided as any,
        mockState as any,
      );
      expect(optionStyles).toHaveProperty('backgroundColor', '#ffffff');
    });

    it('should keep whiteSpace normal by default', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const optionStyles = styles.option?.(
        mockProvided as any,
        mockState as any,
      );
      expect(optionStyles).toHaveProperty('whiteSpace', 'normal');
    });

    it('should use whiteSpace nowrap when menuFitContent is true', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        menuFitContent: true,
      });

      const optionStyles = styles.option?.(
        mockProvided as any,
        mockState as any,
      );
      expect(optionStyles).toHaveProperty('whiteSpace', 'nowrap');
    });
  });

  describe('indicatorSeparator styles', () => {
    it('should have display none', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const indicatorStyles = styles.indicatorSeparator?.({} as any, {} as any);
      expect(indicatorStyles).toHaveProperty('display', 'none');
    });
  });

  describe('menu styles', () => {
    it('should have correct menu styles', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const menuStyles = styles.menu?.(mockProvided as any, {} as any);
      expect(menuStyles).toHaveProperty('backgroundColor', 'white');
      expect(menuStyles).toHaveProperty('borderRadius', '6px');
      expect(menuStyles).toHaveProperty('zIndex', 1000);
    });

    it('should expand to fit content when menuFitContent is true', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        controlWidth: 120,
        menuFitContent: true,
      });

      const menuStyles = styles.menu?.(mockProvided as any, {} as any);
      expect(menuStyles).toHaveProperty('width', 'max-content');
      expect(menuStyles).toHaveProperty('minWidth', '120px');
      expect(menuStyles).toHaveProperty('maxWidth', '480px');
    });

    it('should clamp to controlWidth when menuFitContent is false', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
        controlWidth: 120,
      });

      const menuStyles = styles.menu?.(mockProvided as any, {} as any);
      expect(menuStyles).toHaveProperty('width', '120px');
      expect(menuStyles).toHaveProperty('minWidth', '120px');
      expect(menuStyles).toHaveProperty('maxWidth', '120px');
    });
  });

  describe('menuPortal styles', () => {
    it('should have correct zIndex', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const menuPortalStyles = styles.menuPortal?.(
        mockProvided as any,
        {} as any,
      );
      expect(menuPortalStyles).toHaveProperty('zIndex', 1000);
    });
  });

  describe('menuList styles', () => {
    it('should have correct styles', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const menuListStyles = styles.menuList?.(mockProvided as any, {} as any);
      expect(menuListStyles).toHaveProperty('display', 'flex');
      expect(menuListStyles).toHaveProperty('flexDirection', 'column');
      expect(menuListStyles).toHaveProperty('maxHeight', '228px');
    });
  });

  describe('groupHeading styles', () => {
    it('should have correct styles', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const groupHeadingStyles = styles.groupHeading?.(
        mockProvided as any,
        {} as any,
      );
      expect(groupHeadingStyles).toHaveProperty('fontWeight', 'bold');
      expect(groupHeadingStyles).toHaveProperty('textTransform', 'none');
    });
  });

  describe('valueContainer styles', () => {
    it('should have flex display', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const valueContainerStyles = styles.valueContainer?.(
        mockProvided as any,
        {} as any,
      );
      expect(valueContainerStyles).toHaveProperty('display', 'flex');
      expect(valueContainerStyles).toHaveProperty('alignItems', 'center');
    });
  });

  describe('input styles', () => {
    it('should have zero margin and padding', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const inputStyles = styles.input?.(mockProvided as any, {} as any);
      expect(inputStyles).toHaveProperty('margin', '0');
      expect(inputStyles).toHaveProperty('padding', '0');
    });
  });

  describe('dropdownIndicator styles', () => {
    it('should have correct color', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const dropdownStyles = styles.dropdownIndicator?.(
        mockProvided as any,
        {} as any,
      );
      expect(dropdownStyles).toHaveProperty('color', '#6b7280');
    });
  });

  describe('loadingIndicator styles', () => {
    it('should have correct color', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const loadingStyles = styles.loadingIndicator?.(
        mockProvided as any,
        {} as any,
      );
      expect(loadingStyles).toHaveProperty('color', '#6b7280');
    });
  });

  describe('noOptionsMessage styles', () => {
    it('should have correct font family', () => {
      const styles = createCustomStyles({
        size: 'medium',
        shape: 'square',
        disabled: false,
        hasError: false,
      });

      const noOptionsStyles = styles.noOptionsMessage?.(
        mockProvided as any,
        {} as any,
      );
      expect(noOptionsStyles).toHaveProperty('fontFamily', 'Work Sans');
    });
  });
});

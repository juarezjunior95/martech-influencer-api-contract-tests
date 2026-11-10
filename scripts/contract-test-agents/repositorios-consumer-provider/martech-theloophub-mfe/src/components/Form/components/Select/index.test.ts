jest.mock('react-select', () => {
  return () => null;
});

jest.mock('@hexa-ui/components2', () => ({
  Icon: () => null,
}));

jest.mock('@hexa-ui/icons2', () => ({
  AlertOctagon: () => null,
}));

jest.mock('shared/Styles', () => ({
  StyledErrorLabel: () => null,
  StyledLabel: () => null,
  StyledOptionalFlag: () => null,
}));

jest.mock('./components', () => ({
  CustomClearIndicator: () => null,
  CustomDropdownIndicator: () => null,
  CustomGroupHeading: () => null,
  CustomMultiValueRemove: () => null,
  CustomOption: () => null,
  CustomValueContainer: () => null,
}));

jest.mock('./Select.styles', () => ({
  Container: () => null,
}));

jest.mock('./utils', () => ({
  convertToOption: jest.fn(),
  createCustomStyles: jest.fn(),
  processOptions: jest.fn(() => ({
    isGrouped: false,
    flatOptions: [],
    optionsWithSelectAll: [],
    groupedOptions: undefined,
  })),
  SELECT_ALL_VALUE: '__select_all__',
}));

import * as SelectExports from './index';

describe('Select index exports', () => {
  it('should export Select component', () => {
    expect(SelectExports.Select).toBeDefined();
  });

  it('should export Select as a function', () => {
    expect(typeof SelectExports.Select).toBe('function');
  });
});

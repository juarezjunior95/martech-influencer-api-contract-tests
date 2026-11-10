jest.mock('./components/CustomSlider', () => ({
  CustomSlider: () => null,
}));

jest.mock('./components/Select', () => ({
  Select: () => null,
}));

jest.mock('./components/ChipsSelect/ChipsSelect', () => ({
  ChipsSelect: () => null,
}));

import * as FormExports from './index';

describe('Form index exports', () => {
  it('should export Select', () => {
    expect(FormExports.Select).toBeDefined();
  });
});

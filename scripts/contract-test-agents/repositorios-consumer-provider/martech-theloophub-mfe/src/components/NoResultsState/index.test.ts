jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: () => 'test',
  }),
}));

jest.mock('assets/Search-Empty.svg', () => 'search-empty.svg');

jest.mock('@hexa-ui/components', () => ({
  Button: () => null,
  Heading: () => null,
}));

import * as exports from './index';

describe('NoResultsState index', () => {
  it('should export NoResultsState component', () => {
    expect(exports.NoResultsState).toBeDefined();
  });
});

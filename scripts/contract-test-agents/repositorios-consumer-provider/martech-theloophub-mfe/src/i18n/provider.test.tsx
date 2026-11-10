import React from 'react';
import { FormattedMessage } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { usePreferredLanguageV2 } from 'admin-portal-shared-services';

import IntlProvider, { flattenObject } from './provider';

describe('flattenObject', () => {
  it('should return a flat array', () => {
    const result = flattenObject({
      TEST: {
        TEST_TRANSLATE: 'Translate',
      },
    });
    expect(result).toEqual({ 'TEST.TEST_TRANSLATE': 'Translate' });
  });
});

describe('provider', () => {
  it('should get the correct language from store', () => {
    (usePreferredLanguageV2 as jest.Mock).mockReturnValue({
      preferredLanguage: 'pt-BR',
      defaultLanguage: 'en-US',
    });
    render(
      <IntlProvider>
        <FormattedMessage id="test.translate" />
      </IntlProvider>,
    );
    expect(screen.getByText('Translate')).toBeInTheDocument();
  });

  it('should display the text with the default language if the store does not have one selected', () => {
    (usePreferredLanguageV2 as jest.Mock).mockReturnValue({
      preferredLanguage: 'en-US',
      defaultLanguage: 'en-US',
    });
    render(
      <IntlProvider>
        <FormattedMessage id="test.translate" />
      </IntlProvider>,
    );
    expect(screen.getByText('Translate')).toBeInTheDocument();
  });

  it('should render the text in en-US (default) if the translation in not available', () => {
    (usePreferredLanguageV2 as jest.Mock).mockReturnValue({
      preferredLanguage: 'pt-BR',
      defaultLanguage: 'en-US',
    });
    render(
      <IntlProvider>
        <FormattedMessage id="test.missing" />
      </IntlProvider>,
    );
    expect(
      screen.getByText('Only English option available'),
    ).toBeInTheDocument();
  });
});

import { ReactNode } from 'react';
import { IntlProvider as NativeProvider } from 'react-intl';

import { usePreferredLanguageV2 } from 'admin-portal-shared-services';

import MessageMap from './i18n.d';
import resources from './languages';

const DEFAULT_LANGUAGE = 'en-US';
type IIntlProvider = Readonly<{
  children: ReactNode;
}>;

export const messages: { [language: string]: MessageMap } = {
  ...resources,
};

export function IntlProvider({ children }: IIntlProvider): JSX.Element {
  const { preferredLanguage, defaultLanguage } = usePreferredLanguageV2();

  const locale = preferredLanguage || defaultLanguage;
  const mergedMessages = mergeMessages(messages, preferredLanguage);

  return (
    <NativeProvider
      locale={locale}
      defaultLocale={defaultLanguage}
      messages={mergedMessages}
    >
      {children}
    </NativeProvider>
  );
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const flattenObject = (ob: any): any => {
  const toReturn: { [key: string]: any } = {};

  for (const i in ob) {
    if (typeof ob[i] === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i]);
      // eslint-disable-next-line guard-for-in
      for (const x in flatObject) {
        toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};
/* eslint-enable */

export const mergeMessages = (
  messagesInput: MessageMap,
  selectedLocale: string,
): Record<string, string> => {
  const defaultMessages = flattenObject(messagesInput[DEFAULT_LANGUAGE]);
  const localeMessages = flattenObject(messagesInput[selectedLocale]);
  return { ...defaultMessages, ...localeMessages };
};

export default IntlProvider;

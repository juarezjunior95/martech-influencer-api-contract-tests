import { Provider } from 'react-redux';

import { LoadingDots } from '@hexa-ui/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { ResponsiveWarning } from 'components/ResponsiveWarning/ResponsiveWarning';
import { featureToggles } from 'config/featureToggle';
import {
  AlertProvider,
  DataRefreshModalProvider,
  LastDataRefreshProvider,
  MediaQueryProvider,
  ModalProvider,
} from 'contexts';
import {
  useFeatureToggle,
  useInitializeFeatureToggle,
  useMediaQuery,
} from 'hooks';
import { store } from 'redux/store';
import { StyledAppContainer } from 'shared/Styles';

import { EnvConfig, EnvProvider } from './components';
import { IntlProvider } from './i18n';
import Router from './Router';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

export default function App(props: Readonly<EnvConfig>) {
  const { isReady: isFeatureToggleReady } = useInitializeFeatureToggle(
    props.OPTIMIZELY_KEY,
  );
  if (!isFeatureToggleReady)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 120px)',
        }}
      >
        <LoadingDots />
      </div>
    );

  return (
    <QueryClientProvider client={queryClient}>
      <EnvProvider env={props}>
        <ErrorBoundary>
          <IntlProvider>
            <Provider store={store}>
              <MediaQueryProvider>
                <LastDataRefreshProvider>
                  <DataRefreshModalProvider>
                    <AlertProvider>
                      <ModalProvider>
                        <StyledAppContainer>
                          <ConditionalContent />
                        </StyledAppContainer>
                      </ModalProvider>
                    </AlertProvider>
                  </DataRefreshModalProvider>
                </LastDataRefreshProvider>
              </MediaQueryProvider>
            </Provider>
          </IntlProvider>
        </ErrorBoundary>
      </EnvProvider>
    </QueryClientProvider>
  );
}

const ConditionalContent = () => {
  const isSmallScreen = useMediaQuery('(max-width: 1199px)');
  const [isDevelopmentViewer, isDevelopmentViewerReady] = useFeatureToggle(
    featureToggles.developmentViewer,
  );

  if (isDevelopmentViewerReady && isDevelopmentViewer) {
    console.log('OneWayReports: Development viewer is enabled!');
  }

  return isSmallScreen ? <ResponsiveWarning /> : <Router />;
};

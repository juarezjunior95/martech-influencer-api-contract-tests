import React, { Component, ReactNode } from 'react';

import { DefaultErrorFallback } from './components/DefaultErrorFallback/DefaultErrorFallback';

type Props = {
  children: ReactNode;
  dataTestId?: string;
};

type State = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  isReseting: boolean;
};

declare global {
  interface Window {
    msCrypto?: Crypto;
    newrelic?: {
      setCustomAttribute: (
        key: string,
        value: string | number | boolean,
      ) => void;
      addPageAction: (name: string, attributes?: Record<string, any>) => void;
      noticeError: (
        error: Error,
        customAttributes?: Record<string, any>,
      ) => void;
      setErrorHandler: (handler: (error: Error) => void) => void;
      finished: boolean;
    };
  }
}

const getWindow = (): Window => globalThis as unknown as Window;

class ErrorBoundaryClass extends Component<Props, State> {
  private readonly resetTimeoutId: number | null = null;
  private errorId: string | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isReseting: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const globalForCrypto = globalThis as typeof globalThis & {
      msCrypto?: Pick<Crypto, 'getRandomValues'>;
    };
    const webCrypto = globalThis.crypto || globalForCrypto.msCrypto;
    const array = new Uint32Array(1);
    const randomNumber = webCrypto.getRandomValues(array)?.[0] ?? '';

    this.errorId = `error_${Date.now()}_${randomNumber.toString(36).slice(2, 11)}`;

    this.setState({
      error,
      errorInfo,
    });

    getWindow().newrelic?.setCustomAttribute('errorId', this.errorId);
    getWindow().newrelic?.noticeError(error, {
      errorId: this.errorId,
      errorMessage: error.message,
    });
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetError = async () => {
    if (this.state.isReseting) {
      return;
    }

    this.setState({ isReseting: true });

    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    getWindow().newrelic?.addPageAction('ErrorBoundaryReset', {
      errorId: this.errorId,
      resetMethod: 'manual',
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isReseting: false,
    });
    this.errorId = null;
  };

  reloadPage = () => {
    getWindow().newrelic?.addPageAction('ErrorBoundaryReload', {
      errorId: this.errorId,
      timestamp: new Date().toISOString(),
    });

    getWindow().location.reload();
  };

  render() {
    const { hasError, error, errorInfo, isReseting } = this.state;
    const { children, dataTestId } = this.props;

    if (hasError) {
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          isReseting={isReseting}
          reloadPage={this.reloadPage}
          errorId={this.errorId}
          dataTestId={dataTestId ? `${dataTestId}-boundary` : undefined}
        />
      );
    }

    return children;
  }
}

export const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props} />;
};

import React from 'react';

export type EnvConfig = {
  name: string;
  ENV: string;
  ENV_TYPE: string;
  OPTIMIZELY_KEY: string;
  INSIGHTS_COPILOT_BASE_URL?: string;
};

const defaultInitialValue: EnvConfig = {
  name: '',
  ENV: '',
  ENV_TYPE: '',
  OPTIMIZELY_KEY: '',
  INSIGHTS_COPILOT_BASE_URL: '',
};

export const EnvContext = React.createContext(defaultInitialValue);

export const useEnvContext = () => React.useContext(EnvContext);

export const EnvProvider = ({
  env,
  children,
}: {
  env: EnvConfig;
  children: React.ReactNode;
}) => <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;

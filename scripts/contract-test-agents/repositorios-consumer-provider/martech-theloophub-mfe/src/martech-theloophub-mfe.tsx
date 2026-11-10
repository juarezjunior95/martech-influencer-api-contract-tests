import React from 'react';
import ReactDOM from 'react-dom';

import { useLogService } from 'admin-portal-shared-services';
import singleSpaReact from 'single-spa-react';

import App from './App';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(error: Error) {
    useLogService().error(error);

    return <></>;
  },
});

export const { bootstrap, mount, unmount } = reactLifecycles;

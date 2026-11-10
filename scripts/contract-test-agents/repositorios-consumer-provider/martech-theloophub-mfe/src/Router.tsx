import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ModalKpi } from 'components';
import { InsightsCopilot } from 'components/ai/components/InsightsCopilot';
import Sidebar from 'components/Sidebar/Sidebar';
import { APP_BASENAME } from 'config/api';
import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';
import useMakeRoutes from 'hooks/useMakeRoutes/useMakeRoutes';

const Router = (): JSX.Element => {
  const routes = useMakeRoutes();
  const [isAiChatEnabled] = useFeatureToggle(featureToggles.aiChat.id);

  return (
    <BrowserRouter basename={APP_BASENAME}>
      <Sidebar />
      <Routes>
        {routes?.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
      <ModalKpi />
      {isAiChatEnabled && <InsightsCopilot />}
    </BrowserRouter>
  );
};

export default Router;

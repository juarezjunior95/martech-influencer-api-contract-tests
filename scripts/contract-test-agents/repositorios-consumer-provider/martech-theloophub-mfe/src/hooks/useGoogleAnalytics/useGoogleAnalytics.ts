import { useAuthenticationService as authenticationService } from 'admin-portal-shared-services';
import { useAnalyticsTrack } from 'martech-portal-shared-services';

interface IUseGoogleAnalytics {
  event_category: string;
  event_action: string;
  event_label: string;
  [key: string]: string;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const useGoogleAnalytics = () => {
  const analyticsTrack = useAnalyticsTrack();
  const userUid = authenticationService().getUserId();

  const trackGA = ({
    event_category,
    event_action,
    event_label,
  }: IUseGoogleAnalytics) =>
    analyticsTrack({
      event: 'GAEvent',
      event_category,
      event_action,
      event_label,
      userUid,
    });

  return trackGA;
};

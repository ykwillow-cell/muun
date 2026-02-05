import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-9D66VHJ97H";

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

/**
 * GA4 맞춤 이벤트 전송 함수
 * @param eventName 이벤트 이름 (예: 'check_fortune_result', 'select_fortune_category')
 * @param params 이벤트와 함께 전송할 파라미터 객체
 */
export const trackCustomEvent = (eventName: string, params?: object) => {
  ReactGA.event(eventName, params);
};

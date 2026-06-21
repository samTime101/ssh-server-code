const STORAGE_KEY = "loginFailedAttempts";
const CAPTCHA_THRESHOLD = 2;

export const getLoginFailedAttempts = (): number => {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const incrementLoginFailedAttempts = (): number => {
  const next = getLoginFailedAttempts() + 1;
  sessionStorage.setItem(STORAGE_KEY, String(next));
  return next;
};

export const resetLoginFailedAttempts = (): void => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const shouldShowLoginCaptcha = (): boolean => {
  return getLoginFailedAttempts() >= CAPTCHA_THRESHOLD;
};

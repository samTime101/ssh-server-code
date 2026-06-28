export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "";

export const isRecaptchaConfigured = Boolean(RECAPTCHA_SITE_KEY);

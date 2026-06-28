export function isRecaptchaChallengeOpen() {
  return Boolean(document.querySelector('iframe[src*="recaptcha/api2/bframe"]'));
}

export function isRecaptchaIframeFocused() {
  const active = document.activeElement;
  return active instanceof HTMLIFrameElement && active.src.includes("recaptcha");
}

export function isRecaptchaInteractionTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest('iframe[src*="recaptcha"]') ||
      target.closest('iframe[title="reCAPTCHA"]') ||
      target.closest(".grecaptcha-badge") ||
      target.closest('div[style*="z-index: 2000000000"]')
  );
}

export function shouldPreventDialogDismissOnRecaptcha(target: EventTarget | null) {
  return (
    isRecaptchaInteractionTarget(target) || isRecaptchaIframeFocused() || isRecaptchaChallengeOpen()
  );
}

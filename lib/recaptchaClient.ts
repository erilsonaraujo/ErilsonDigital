export const getRecaptchaToken = async (action: string) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === 'undefined') return null;

  const waitForRecaptcha = () =>
    new Promise<void>((resolve, reject) => {
      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if ((window as any).grecaptcha?.execute) {
          window.clearInterval(timer);
          resolve();
        } else if (attempts > 20) {
          window.clearInterval(timer);
          reject(new Error('Recaptcha not loaded'));
        }
      }, 150);
    });

  try {
    await waitForRecaptcha();
    const token = await (window as any).grecaptcha.execute(siteKey, { action });
    return token as string;
  } catch {
    return null;
  }
};

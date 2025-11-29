export function trackEvent(eventName: string, payload?: Record<string, any>): void {
  // Minimal client-side tracker; later integrate with proper analytics
  try {
    console.debug('[analytics]', eventName, payload || {});
  } catch (_) {}
}








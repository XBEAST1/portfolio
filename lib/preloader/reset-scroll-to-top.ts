export const SCROLL_TO_TOP_EVENT = "portfolio:scroll-to-top";

export function resetScrollToTop(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  window.dispatchEvent(new Event(SCROLL_TO_TOP_EVENT));
}

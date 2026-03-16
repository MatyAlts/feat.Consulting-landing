const SCROLL_ANCHOR_KEY = "feat_scroll_anchor";

/**
 * Saves the current scroll position of the main content area.
 * Targets either the emulator container (for desktop view) or the main element (for mobile view).
 */
export const saveScrollAnchor = () => {
  const main = document.querySelector("main") as HTMLElement | null;
  const emulator = document.querySelector(".emulator-container") as HTMLElement | null;
  
  // In our project, 'main' is usually the scroll container in both mobile and desktop (inside emulator)
  const scrollContainer = main || emulator;
  
  if (scrollContainer) {
    sessionStorage.setItem(SCROLL_ANCHOR_KEY, scrollContainer.scrollTop.toString());
  }
};

/**
 * Retrieves the saved scroll position from sessionStorage.
 */
export const getScrollAnchor = (): number | null => {
  const saved = sessionStorage.getItem(SCROLL_ANCHOR_KEY);
  return saved ? parseInt(saved, 10) : null;
};

/**
 * Clears the saved scroll position from sessionStorage.
 */
export const clearScrollAnchor = () => {
  sessionStorage.removeItem(SCROLL_ANCHOR_KEY);
};

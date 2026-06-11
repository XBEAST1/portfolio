/** Desktop layout from 1025px — iPad Pro (1024px) and below stay tablet/mobile. */
export const BREAKPOINT_MD_PX = 1025;

/** Keep in sync with `--breakpoint-lg` (80rem) in `app/globals.css`. */
export const BREAKPOINT_LG_PX = 1280;

export const mediaQueryMd = `(min-width: ${BREAKPOINT_MD_PX}px)` as const;
export const mediaQueryLg = `(min-width: ${BREAKPOINT_LG_PX}px)` as const;
export const mediaQueryBelowMd =
  `(max-width: ${BREAKPOINT_MD_PX - 1}px)` as const;

/** Keep in sync with `--breakpoint-md` in `app/globals.css`. */
export const BREAKPOINT_MD_PX = 1440;

/** Keep in sync with `--breakpoint-lg` in `app/globals.css`. */
export const BREAKPOINT_LG_PX = 1600;

export const mediaQueryMd = `(min-width: ${BREAKPOINT_MD_PX}px)` as const;
export const mediaQueryLg = `(min-width: ${BREAKPOINT_LG_PX}px)` as const;

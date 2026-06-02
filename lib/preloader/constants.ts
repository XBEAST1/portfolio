export const PRELOADER_STATUS_MESSAGES: readonly string[] = [
  "Booting environment",
  "Loading modules",
  "Compiling interface",
  "Ready",
] as const;

export const PRELOADER_ANIMATION = {
  progressDuration: 2,
  exitDuration: 0.45,
  curtainDuration: 1.1,
  ringRotationDuration: 10,
} as const;

export const PRELOADER_PARTS = {
  root: "preloader-root",
  curtainTop: "curtain-top",
  curtainBottom: "curtain-bottom",
  content: "content",
  glow: "glow",
  ring: "ring",
  ringAccent: "ring-accent",
  eyebrow: "eyebrow",
  char: "char",
  progress: "progress",
  status: "status",
  count: "count",
  bar: "bar",
  corner: "corner",
} as const;

export type PreloaderPart =
  (typeof PRELOADER_PARTS)[keyof typeof PRELOADER_PARTS];

export function preloaderSelector(part: PreloaderPart): string {
  return `[data-preloader="${part}"]`;
}

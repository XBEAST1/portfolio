"use client";

import { isTouchPrimaryDevice, prefersReducedMotion } from "@/lib/animation";
import {
  isLraCapableDevice,
  isReducedAndroidUa,
} from "./device";

/** Web Vibration API only — no Taptic Engine on iOS Safari. */
type HapticPattern = "tap" | "select" | "success" | "reveal";

/**
 * Actuator tier inferred from device heuristics (no web API exposes LRA vs ERM).
 * LRA phones get short, crisp pulses; ERM phones get longer, simpler ones.
 */
export type HapticTier = "lra" | "default";

/** Short pulses tuned for LRAs (Pixel, flagships) — ~10–20 ms per Android haptics guidance. */
const LRA_HAPTIC_PATTERNS: Readonly<Record<HapticPattern, number | number[]>> =
  {
    tap: 6,
    select: 4,
    success: [4, 40, 4],
    reveal: 2,
  };

/** Longer pulses for ERM motors that need spin-up time to feel perceptible. */
const DEFAULT_HAPTIC_PATTERNS: Readonly<
  Record<HapticPattern, number | number[]>
> = {
  tap: 55,
  select: 50,
  success: [50, 50, 50],
  reveal: 38,
};

interface NavigatorUAData {
  readonly mobile: boolean;
  getHighEntropyValues(
    hints: readonly string[],
  ): Promise<{ model?: string }>;
}

const DEV_TIER_OVERRIDE_KEY = "portfolio-haptic-tier";

let cachedTier: HapticTier | null = null;
let tierResolution: Promise<HapticTier> | null = null;

function readCachedTier(): HapticTier | null {
  return cachedTier;
}

function getUAData(): NavigatorUAData | undefined {
  return (navigator as Navigator & { userAgentData?: NavigatorUAData })
    .userAgentData;
}

function readDevTierOverride(): HapticTier | null {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  try {
    const value = localStorage.getItem(DEV_TIER_OVERRIDE_KEY);

    if (value === "lra" || value === "default") {
      return value;
    }
  } catch {
    /* localStorage unavailable */
  }

  return null;
}

async function fetchModelFromClientHints(): Promise<string | null> {
  const uaData = getUAData();

  if (!uaData?.mobile || !window.isSecureContext) {
    return null;
  }

  try {
    const { model } = await uaData.getHighEntropyValues(["model"]);
    return model?.trim() || null;
  } catch {
    return null;
  }
}

async function resolveHapticTier(): Promise<HapticTier> {
  if (cachedTier === "lra") {
    return "lra";
  }

  const devOverride = readDevTierOverride();

  if (devOverride) {
    cachedTier = devOverride;
    return devOverride;
  }

  const ua = navigator.userAgent;

  if (isLraCapableDevice({ ua })) {
    cachedTier = "lra";
    return "lra";
  }

  const model = await fetchModelFromClientHints();

  if (readCachedTier() === "lra") {
    return "lra";
  }

  if (isLraCapableDevice({ model: model ?? undefined })) {
    cachedTier = "lra";
    return "lra";
  }

  cachedTier = "default";
  return "default";
}

async function retryTierFromClientHints(): Promise<void> {
  if (cachedTier === "lra" || !isReducedAndroidUa(navigator.userAgent)) {
    return;
  }

  const model = await fetchModelFromClientHints();

  if (isLraCapableDevice({ model: model ?? undefined })) {
    cachedTier = "lra";
  }
}

function ensureHapticTierResolved(): Promise<HapticTier> {
  if (cachedTier !== null) {
    return Promise.resolve(cachedTier);
  }

  if (!tierResolution) {
    tierResolution = resolveHapticTier();
  }

  return tierResolution;
}

function prewarmHapticTier(): void {
  void ensureHapticTierResolved();

  if (
    cachedTier === "default" &&
    typeof navigator !== "undefined" &&
    isReducedAndroidUa(navigator.userAgent)
  ) {
    void retryTierFromClientHints();
  }
}

/**
 * Returns the cached actuator tier.
 * May return `"default"` optimistically before Client Hints finish resolving —
 * use after page load or a touch interaction for an accurate value.
 */
export function getHapticTier(): HapticTier {
  if (cachedTier !== null) {
    return cachedTier;
  }

  if (
    typeof navigator !== "undefined" &&
    isLraCapableDevice({ ua: navigator.userAgent })
  ) {
    cachedTier = "lra";
    return "lra";
  }

  void ensureHapticTierResolved();

  return "default";
}

function getPatternDuration(pattern: HapticPattern): number | number[] {
  const patterns =
    cachedTier === "lra" ? LRA_HAPTIC_PATTERNS : DEFAULT_HAPTIC_PATTERNS;

  return patterns[pattern];
}

/** Minimum gap between haptics so nested buttons do not double-fire (ms). */
export const HAPTIC_DEBOUNCE_MS = 50;

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-scroll-hover], [data-haptic]';

const TOUCH_TYPES: ReadonlySet<string> = new Set(["touch", "pen"]);
const TAP_MOVE_CANCEL_PX = 10;

let lastTriggerAt = 0;
let pendingHaptic: HapticPattern | null = null;
let touchTap: {
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  readonly target: HTMLElement;
  cancelled: boolean;
} | null = null;
const suppressedPointerIds = new Set<number>();

function canVibrate(): boolean {
  return (
    typeof window !== "undefined" &&
    "vibrate" in navigator &&
    isTouchPrimaryDevice() &&
    !prefersReducedMotion()
  );
}

function vibrate(pattern: HapticPattern, skipDebounce = false): boolean {
  if (!canVibrate()) {
    return false;
  }

  const now = performance.now();

  if (!skipDebounce && now - lastTriggerAt < HAPTIC_DEBOUNCE_MS) {
    return false;
  }

  lastTriggerAt = now;
  return navigator.vibrate(getPatternDuration(pattern));
}

function deliverHaptic(pattern: HapticPattern, skipDebounce = false): void {
  if (!canVibrate()) {
    return;
  }

  const fire = (): void => {
    vibrate(pattern, skipDebounce);
  };

  if (cachedTier !== null) {
    fire();
    return;
  }

  void ensureHapticTierResolved().then(fire);
}

function tryDeliverPending(): boolean {
  if (!pendingHaptic) {
    return false;
  }

  const pattern = pendingHaptic;

  if (cachedTier !== null) {
    if (vibrate(pattern, true)) {
      pendingHaptic = null;
      return true;
    }

    return false;
  }

  void ensureHapticTierResolved().then(() => {
    if (pendingHaptic === pattern && vibrate(pattern, true)) {
      pendingHaptic = null;
    }
  });

  return false;
}

function getInteractiveTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
}

function getTapPattern(target: HTMLElement): HapticPattern {
  return target.getAttribute("data-haptic") === "select" ? "select" : "tap";
}

/** Light pulse when scroll-revealed content enters view (e.g. project gallery frames). */
export function triggerRevealHaptic(): void {
  deliverHaptic("reveal", true);
}

/** Queue for first touch (cold load); also tries immediately after SPA link taps. */
export function triggerMilestoneHaptic(pattern: HapticPattern): void {
  if (!canVibrate()) {
    return;
  }

  pendingHaptic = pattern;
  tryDeliverPending();
}

export function initTouchHaptics(): (() => void) | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  prewarmHapticTier();

  const opts: AddEventListenerOptions = { capture: true, passive: true };

  const onPointerDown = (event: PointerEvent): void => {
    if (!TOUCH_TYPES.has(event.pointerType)) {
      return;
    }

    prewarmHapticTier();

    if (tryDeliverPending()) {
      suppressedPointerIds.add(event.pointerId);
      return;
    }

    const target = getInteractiveTarget(event.target);

    if (!target) {
      return;
    }

    touchTap = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      target,
      cancelled: false,
    };
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (!touchTap || touchTap.pointerId !== event.pointerId || touchTap.cancelled) {
      return;
    }

    const dx = event.clientX - touchTap.startX;
    const dy = event.clientY - touchTap.startY;

    if (Math.hypot(dx, dy) > TAP_MOVE_CANCEL_PX) {
      touchTap.cancelled = true;
    }
  };

  const onPointerUp = (event: PointerEvent): void => {
    if (suppressedPointerIds.delete(event.pointerId)) {
      return;
    }

    if (!touchTap || touchTap.pointerId !== event.pointerId) {
      return;
    }

    const { target, cancelled } = touchTap;
    touchTap = null;

    if (cancelled) {
      return;
    }

    const releaseTarget = getInteractiveTarget(event.target);

    if (!releaseTarget || releaseTarget !== target) {
      return;
    }

    deliverHaptic(getTapPattern(target));
  };

  const onPointerCancel = (event: PointerEvent): void => {
    if (touchTap?.pointerId === event.pointerId) {
      touchTap = null;
    }

    suppressedPointerIds.delete(event.pointerId);
  };

  document.addEventListener("pointerdown", onPointerDown, opts);
  document.addEventListener("pointermove", onPointerMove, opts);
  document.addEventListener("pointerup", onPointerUp, opts);
  document.addEventListener("pointercancel", onPointerCancel, opts);

  return (): void => {
    document.removeEventListener("pointerdown", onPointerDown, opts);
    document.removeEventListener("pointermove", onPointerMove, opts);
    document.removeEventListener("pointerup", onPointerUp, opts);
    document.removeEventListener("pointercancel", onPointerCancel, opts);
    touchTap = null;
    suppressedPointerIds.clear();
  };
}

if (typeof window !== "undefined") {
  prewarmHapticTier();
}

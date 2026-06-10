"use client";

import { isTouchPrimaryDevice, prefersReducedMotion } from "@/lib/animation";

/** Web Vibration API only — no Taptic Engine on iOS Safari. */
type HapticPattern = "tap" | "select" | "success" | "reveal";

/**
 * Haptic intensity config (Android: vibration duration in ms).
 * Higher number = stronger/longer pulse. Arrays are [vibrate, pause, vibrate, ...].
 */
export const HAPTIC_PATTERNS: Readonly<Record<HapticPattern, number | number[]>> =
  {
    tap: 6,
    select: 4,
    success: [4, 50, 4],
    reveal: 1,
  };

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
  return navigator.vibrate(HAPTIC_PATTERNS[pattern]);
}

function tryDeliverPending(): boolean {
  if (!pendingHaptic) {
    return false;
  }

  if (vibrate(pendingHaptic, true)) {
    pendingHaptic = null;
    return true;
  }

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
  vibrate("reveal", true);
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

  const opts: AddEventListenerOptions = { capture: true, passive: true };

  const onPointerDown = (event: PointerEvent): void => {
    if (!TOUCH_TYPES.has(event.pointerType)) {
      return;
    }

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

    vibrate(getTapPattern(target));
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

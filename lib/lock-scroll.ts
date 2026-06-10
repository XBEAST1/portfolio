"use client";

import { setPageScrollPaused } from "@/lib/animation";

let lockCount = 0;
let scrollY = 0;
let touchMoveHandler: ((event: TouchEvent) => void) | null = null;

function preventTouchScroll(event: TouchEvent): void {
  event.preventDefault();
}

function applyLock(): void {
  scrollY = window.scrollY;
  const { style } = document.body;

  style.overflow = "hidden";
  style.position = "fixed";
  style.top = `-${scrollY}px`;
  style.width = "100%";
  document.documentElement.style.overflow = "hidden";

  touchMoveHandler = preventTouchScroll;
  document.addEventListener("touchmove", touchMoveHandler, { passive: false });

  setPageScrollPaused(true);
}

function releaseLock(restoreScroll: boolean): void {
  const { style } = document.body;

  style.overflow = "";
  style.position = "";
  style.top = "";
  style.width = "";
  document.documentElement.style.overflow = "";

  if (touchMoveHandler) {
    document.removeEventListener("touchmove", touchMoveHandler);
    touchMoveHandler = null;
  }

  setPageScrollPaused(false);
  window.scrollTo(0, restoreScroll ? scrollY : 0);
}

export function lockPageScroll(): void {
  if (lockCount === 0) {
    applyLock();
  }

  lockCount += 1;
}

export function unlockPageScroll(
  options: { readonly restoreScroll?: boolean } = {},
): void {
  if (lockCount <= 0) {
    return;
  }

  lockCount -= 1;

  if (lockCount === 0) {
    releaseLock(options.restoreScroll !== false);
  }
}

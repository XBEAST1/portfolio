"use client";

import gsap from "gsap";
import type { MouseEvent } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_TO_TOP_EVENT } from "@/lib/preloader/reset-scroll-to-top";
import { runScrollHoverSyncs } from "@/lib/scroll-hover-sync";
let isScrollTriggerRegistered: boolean = false;
let scrollLayoutRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let hashScrollActive = false;
let pendingLayoutRefresh = false;
let nativeScrollFrameId: number | null = null;

const NAVBAR_SCROLL_OFFSET = 80;

/** Re-measure ScrollTrigger after in-flow Services panel height settles. */
export function scheduleScrollLayoutRefresh(): void {
  if (hashScrollActive) {
    pendingLayoutRefresh = true;
    return;
  }

  if (scrollLayoutRefreshTimer !== null) {
    clearTimeout(scrollLayoutRefreshTimer);
  }

  scrollLayoutRefreshTimer = setTimeout((): void => {
    scrollLayoutRefreshTimer = null;
    registerScrollTrigger().refresh();
  }, 80);
}

function flushPendingLayoutRefresh(): void {
  if (!pendingLayoutRefresh) {
    return;
  }

  pendingLayoutRefresh = false;
  registerScrollTrigger().refresh();
}

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

function setScrollTop(y: number): void {
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

function nativeScrollToY(
  targetY: number,
  duration: number,
  onComplete?: () => void,
): void {
  if (nativeScrollFrameId !== null) {
    cancelAnimationFrame(nativeScrollFrameId);
    nativeScrollFrameId = null;
  }

  const html = document.documentElement;
  const previousScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const step = (now: number): void => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    const eased = easeInOutCubic(progress);
    setScrollTop(startY + distance * eased);

    if (progress < 1) {
      nativeScrollFrameId = requestAnimationFrame(step);
      return;
    }

    setScrollTop(targetY);
    nativeScrollFrameId = null;
    html.style.scrollBehavior = previousScrollBehavior;
    onComplete?.();
  };

  nativeScrollFrameId = requestAnimationFrame(step);
}

export function registerScrollTrigger(): typeof ScrollTrigger {
  if (!isScrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    isScrollTriggerRegistered = true;
  }

  return ScrollTrigger;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isTouchPrimaryDevice(): boolean {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function refreshScrollTriggers(): void {
  if (hashScrollActive) {
    pendingLayoutRefresh = true;
    return;
  }

  registerScrollTrigger().refresh();
}

/** Re-measure when large below-the-fold sections enter view (post preloader / layout settle). */
function initHeavySectionScrollRefresh(): (() => void) | undefined {
  const sections = document.querySelectorAll<HTMLElement>(".section-heavy");
  if (sections.length === 0) {
    return undefined;
  }

  const observer = new IntersectionObserver(
    (entries): void => {
      if (entries.some((entry) => entry.isIntersecting)) {
        scheduleScrollLayoutRefresh();
      }
    },
    { rootMargin: "20% 0px" },
  );

  sections.forEach((section) => observer.observe(section));

  return (): void => observer.disconnect();
}

let lenisInstance: Lenis | null = null;

export function getSectionHashFromHref(href: string): string | null {
  const hashIndex = href.indexOf("#");

  if (hashIndex === -1) {
    return null;
  }

  const hash = href.slice(hashIndex + 1).split("#")[0];
  return hash || null;
}

export function handleHomeHashLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  homePath: string,
): void {
  const hash = getSectionHashFromHref(href);

  if (!hash || pathname !== homePath) {
    return;
  }

  event.preventDefault();
  requestAnimationFrame((): void => {
    requestAnimationFrame((): void => {
      scrollToHash(hash);
    });
  });
}

export function scrollToTop(): void {
  hashScrollActive = true;

  const finishScroll = (): void => {
    hashScrollActive = false;
    flushPendingLayoutRefresh();
  };

  if (lenisInstance) {
    lenisInstance.scrollTo(0, {
      lerp: 0,
      duration: 1.2,
      easing: easeInOutCubic,
      onComplete: finishScroll,
    });
  } else {
    nativeScrollToY(0, 1.2, finishScroll);
  }
}

export function scrollToHash(id: string): void {
  const section = document.getElementById(id);
  if (!section) return;

  // Prefer a designated anchor inside the section (skips marquees, intros, etc.)
  const target =
    section.querySelector<HTMLElement>("[data-scroll-anchor]") ?? section;

  const targetTop = target.getBoundingClientRect().top + window.scrollY;

  hashScrollActive = true;

  const finishHashScroll = (): void => {
    hashScrollActive = false;
    flushPendingLayoutRefresh();
  };

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: -NAVBAR_SCROLL_OFFSET,
      lerp: 0,
      duration: 1.2,
      easing: easeInOutCubic,
      onComplete: finishHashScroll,
    });
  } else {
    const targetY = Math.max(0, targetTop - NAVBAR_SCROLL_OFFSET);
    nativeScrollToY(targetY, 1.2, finishHashScroll);
  }
}

export function initScrollSystem(): (() => void) | undefined {
  if (prefersReducedMotion()) {
    return undefined;
  }

  const ScrollTrigger = registerScrollTrigger();
  const refreshOnLoad = (): void => {
    refreshScrollTriggers();
  };
  const refreshOnResize = (): void => {
    refreshScrollTriggers();
  };

  window.addEventListener("load", refreshOnLoad);
  window.addEventListener("resize", refreshOnResize);
  window.visualViewport?.addEventListener("resize", refreshOnResize);

  if (isTouchPrimaryDevice()) {
    const syncScrollTrigger = (): void => {
      ScrollTrigger.update();
      runScrollHoverSyncs();
    };

    window.addEventListener("scroll", syncScrollTrigger, { passive: true });
    requestAnimationFrame(refreshScrollTriggers);
    const disconnectHeavySectionObserver = initHeavySectionScrollRefresh();

    return (): void => {
      disconnectHeavySectionObserver?.();
      window.removeEventListener("scroll", syncScrollTrigger);
      window.removeEventListener("load", refreshOnLoad);
      window.removeEventListener("resize", refreshOnResize);
      window.visualViewport?.removeEventListener("resize", refreshOnResize);
    };
  }

  const lenis: Lenis = new Lenis({
    smoothWheel: true,
    autoRaf: false,
  });
  lenisInstance = lenis;
  const syncScrollToTop = (): void => {
    lenis.scrollTo(0, { immediate: true });
    refreshScrollTriggers();
  };

  document.documentElement.classList.add("lenis");
  lenis.on("scroll", (): void => {
    ScrollTrigger.update();
    runScrollHoverSyncs();
  });
  syncScrollToTop();
  window.addEventListener(SCROLL_TO_TOP_EVENT, syncScrollToTop);

  const tickerCallback = (time: number): void => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);
  requestAnimationFrame(refreshScrollTriggers);
  const disconnectHeavySectionObserver = initHeavySectionScrollRefresh();

  return (): void => {
    disconnectHeavySectionObserver?.();
    window.removeEventListener(SCROLL_TO_TOP_EVENT, syncScrollToTop);
    window.removeEventListener("load", refreshOnLoad);
    window.removeEventListener("resize", refreshOnResize);
    window.visualViewport?.removeEventListener("resize", refreshOnResize);
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
    lenisInstance = null;
    document.documentElement.classList.remove("lenis");
  };
}

"use client";

import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_TO_TOP_EVENT } from "@/lib/preloader/reset-scroll-to-top";
import { runScrollHoverSyncs } from "@/lib/scroll-hover-sync";
let isScrollTriggerRegistered: boolean = false;
let scrollLayoutRefreshTimer: ReturnType<typeof setTimeout> | null = null;

/** Re-measure ScrollTrigger after in-flow Services panel height settles. */
export function scheduleScrollLayoutRefresh(): void {
  if (scrollLayoutRefreshTimer !== null) {
    clearTimeout(scrollLayoutRefreshTimer);
  }

  scrollLayoutRefreshTimer = setTimeout((): void => {
    scrollLayoutRefreshTimer = null;
    registerScrollTrigger().refresh();
  }, 80);
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

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export function scrollToHash(id: string): void {
  const section = document.getElementById(id);
  if (!section) return;

  // Prefer a designated anchor inside the section (skips marquees, intros, etc.)
  const target =
    section.querySelector<HTMLElement>("[data-scroll-anchor]") ?? section;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: -80,
      lerp: 0,
      duration: 1.2,
      easing: easeInOutCubic,
    });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
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

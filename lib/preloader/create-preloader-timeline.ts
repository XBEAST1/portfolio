import gsap from "gsap";
import { scheduleScrollLayoutRefresh } from "@/lib/animation";
import {
  PRELOADER_ANIMATION,
  PRELOADER_PARTS,
  PRELOADER_STATUS_MESSAGES,
  preloaderSelector,
  type PreloaderPart,
} from "@/lib/preloader/constants";
import { getLoaderStatusMessage } from "@/lib/preloader/get-loader-status-message";
import { resetScrollToTop } from "@/lib/preloader/reset-scroll-to-top";

export interface PreloaderTimelineOptions {
  readonly scope: HTMLElement;
  readonly timeline?: gsap.core.Timeline;
}

interface SkipPreloaderOptions {
  readonly resetScroll?: boolean;
}

interface PreloaderElements {
  readonly count: Element | null;
  readonly status: Element | null;
  readonly glow: Element | null;
  readonly ring: Element | null;
  readonly ringAccent: Element | null;
  readonly eyebrow: Element | null;
  readonly chars: NodeListOf<Element>;
  readonly progress: Element | null;
  readonly corners: NodeListOf<Element>;
  readonly bar: Element | null;
  readonly curtainTop: Element | null;
  readonly curtainBottom: Element | null;
  readonly content: Element | null;
}

function queryPreloaderPart(
  scope: HTMLElement,
  part: PreloaderPart,
): Element | null {
  return scope.querySelector(preloaderSelector(part));
}

function queryPreloaderParts(scope: HTMLElement): PreloaderElements {
  return {
    count: queryPreloaderPart(scope, PRELOADER_PARTS.count),
    status: queryPreloaderPart(scope, PRELOADER_PARTS.status),
    glow: queryPreloaderPart(scope, PRELOADER_PARTS.glow),
    ring: queryPreloaderPart(scope, PRELOADER_PARTS.ring),
    ringAccent: queryPreloaderPart(scope, PRELOADER_PARTS.ringAccent),
    eyebrow: queryPreloaderPart(scope, PRELOADER_PARTS.eyebrow),
    chars: scope.querySelectorAll(preloaderSelector(PRELOADER_PARTS.char)),
    progress: queryPreloaderPart(scope, PRELOADER_PARTS.progress),
    corners: scope.querySelectorAll(preloaderSelector(PRELOADER_PARTS.corner)),
    bar: queryPreloaderPart(scope, PRELOADER_PARTS.bar),
    curtainTop: queryPreloaderPart(scope, PRELOADER_PARTS.curtainTop),
    curtainBottom: queryPreloaderPart(scope, PRELOADER_PARTS.curtainBottom),
    content: queryPreloaderPart(scope, PRELOADER_PARTS.content),
  };
}

function setPreloaderInitialState(elements: PreloaderElements): void {
  if (elements.glow) {
    gsap.set(elements.glow, { scale: 0.6, opacity: 0 });
  }

  if (elements.ring) {
    gsap.set(elements.ring, { scale: 0.85, opacity: 0, rotation: -90 });
  }

  if (elements.eyebrow) {
    gsap.set(elements.eyebrow, { y: 16, opacity: 0 });
  }

  if (elements.chars.length > 0) {
    gsap.set(elements.chars, { yPercent: 120, opacity: 0 });
  }

  if (elements.progress) {
    gsap.set(elements.progress, { y: 20, opacity: 0 });
  }

  if (elements.corners.length > 0) {
    gsap.set(elements.corners, { y: 20, opacity: 0 });
  }

  if (elements.bar) {
    gsap.set(elements.bar, {
      scaleX: 0,
      transformOrigin: "left center",
    });
  }

  if (elements.count) {
    elements.count.textContent = "0";
  }

  if (elements.status) {
    elements.status.textContent = PRELOADER_STATUS_MESSAGES[0];
  }
}

function startRingRotation(ringAccent: Element | null): void {
  if (!ringAccent) {
    return;
  }

  gsap.to(ringAccent, {
    rotation: 360,
    duration: PRELOADER_ANIMATION.ringRotationDuration,
    ease: "none",
    repeat: -1,
  });
}

function stopRingRotation(ringAccent: Element | null): void {
  if (!ringAccent) {
    return;
  }

  gsap.killTweensOf(ringAccent);
}

export function skipPreloader(
  scope: HTMLElement,
  options: SkipPreloaderOptions = {},
): void {
  const { ringAccent } = queryPreloaderParts(scope);
  const { resetScroll = true } = options;

  if (resetScroll) {
    resetScrollToTop();
  }

  gsap.set(scope, { autoAlpha: 0, pointerEvents: "none" });
  stopRingRotation(ringAccent);
}

export function appendPreloaderTimeline(
  options: PreloaderTimelineOptions,
): gsap.core.Timeline {
  const { scope } = options;
  const elements: PreloaderElements = queryPreloaderParts(scope);
  const timeline: gsap.core.Timeline =
    options.timeline ??
    gsap.timeline({
      defaults: { ease: "power4.out" },
    });
  const counter: { value: number } = { value: 0 };

  gsap.set(scope, { autoAlpha: 1, pointerEvents: "auto" });
  setPreloaderInitialState(elements);
  startRingRotation(elements.ringAccent);

  timeline
    .fromTo(
      elements.glow,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2 },
    )
    .fromTo(
      elements.ring,
      { scale: 0.85, opacity: 0, rotation: -90 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1 },
      "-=0.8",
    )
    .fromTo(
      elements.eyebrow,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      "-=0.9",
    )
    .fromTo(
      elements.chars,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.045,
      },
      "-=0.5",
    )
    .fromTo(
      elements.progress,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      "-=0.45",
    )
    .fromTo(
      elements.corners,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power4.out",
      },
      "-=0.45",
    )
    .fromTo(
      counter,
      { value: 0 },
      {
        value: 100,
        duration: PRELOADER_ANIMATION.progressDuration,
        ease: "power2.inOut",
        snap: { value: 1 },
        onUpdate(): void {
          if (elements.count) {
            elements.count.textContent = `${counter.value}`;
          }

          if (elements.status) {
            elements.status.textContent = getLoaderStatusMessage(counter.value);
          }
        },
      },
    )
    .fromTo(
      elements.bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: PRELOADER_ANIMATION.progressDuration,
        ease: "power2.inOut",
        transformOrigin: "left center",
      },
      "<",
    )
    .to(elements.content, {
      opacity: 0,
      scale: 0.96,
      filter: "blur(6px)",
      duration: PRELOADER_ANIMATION.exitDuration,
      ease: "power3.in",
      onStart(): void {
        stopRingRotation(elements.ringAccent);
      },
    })
    .to(
      elements.curtainTop,
      {
        yPercent: -100,
        duration: PRELOADER_ANIMATION.curtainDuration,
        ease: "power4.inOut",
        onStart(): void {
          resetScrollToTop();
        },
      },
      "-=0.05",
    )
    .to(
      elements.curtainBottom,
      {
        yPercent: 100,
        duration: PRELOADER_ANIMATION.curtainDuration,
        ease: "power4.inOut",
      },
      "<",
    )
    .to(
      scope,
      {
        autoAlpha: 0,
        duration: 0.01,
        pointerEvents: "none",
        onComplete: (): void => {
          scheduleScrollLayoutRefresh();
        },
      },
      "-=0.05",
    );

  return timeline;
}

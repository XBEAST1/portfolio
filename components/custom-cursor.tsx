"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/animation";
import { registerScrollHoverSync } from "@/lib/scroll-hover-sync";

const INTERACTIVE_SELECTOR: string =
  'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor="pointer"], .cursor-pointer';

const SCROLL_HOVER_SELECTOR = "[data-scroll-hover]";

const CURSOR_HOVER_ATTRIBUTE = "data-cursor-hover";
const CURSOR_POSITION_STORAGE_KEY = "portfolio:cursor-position";

const RING_SIZE_DEFAULT = 48;
const RING_SIZE_HOVER = 84;
const RING_TRAIL_DURATION = 0.58;

interface PointerPosition {
  readonly x: number;
  readonly y: number;
}

let lastPointerPosition: PointerPosition | null = null;

function readStoredPointerPosition(): PointerPosition | null {
  if (lastPointerPosition) {
    return lastPointerPosition;
  }

  try {
    const raw = sessionStorage.getItem(CURSOR_POSITION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PointerPosition;
    if (
      typeof parsed.x === "number" &&
      typeof parsed.y === "number" &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function storePointerPosition(position: PointerPosition): void {
  lastPointerPosition = position;

  try {
    sessionStorage.setItem(
      CURSOR_POSITION_STORAGE_KEY,
      JSON.stringify(position),
    );
  } catch {
    // Ignore storage failures in private browsing.
  }
}

interface HoverTargets {
  readonly hoverTarget: HTMLElement | null;
  readonly interactiveTarget: HTMLElement | null;
}

function resolveHoverTargets(x: number, y: number): HoverTargets {
  const elementsUnderPointer: Element[] = document.elementsFromPoint(x, y);

  for (const element of elementsUnderPointer) {
    if (!(element instanceof HTMLElement)) {
      continue;
    }

    if (element.closest("[data-custom-cursor]")) {
      continue;
    }

    const interactiveTarget =
      element.closest<HTMLElement>(INTERACTIVE_SELECTOR);
    const scrollHoverTarget = element.closest<HTMLElement>(
      SCROLL_HOVER_SELECTOR,
    );

    return {
      hoverTarget: interactiveTarget ?? scrollHoverTarget,
      interactiveTarget,
    };
  }

  return {
    hoverTarget: null,
    interactiveTarget: null,
  };
}

export function CustomCursor(): React.ReactElement {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    if (prefersReducedMotion()) {
      return undefined;
    }

    const dotElement: HTMLDivElement | null = dotRef.current;
    const ringElement: HTMLDivElement | null = ringRef.current;

    if (!dotElement || !ringElement) {
      return undefined;
    }

    gsap.set([dotElement, ringElement], {
      xPercent: -50,
      yPercent: -50,
      force3D: true,
    });

    gsap.set(ringElement, {
      width: RING_SIZE_DEFAULT,
      height: RING_SIZE_DEFAULT,
    });

    const storedPosition = readStoredPointerPosition();

    gsap.set([dotElement, ringElement], {
      autoAlpha: storedPosition ? 1 : 0,
    });

    const moveDot = gsap.quickTo(dotElement, "x", {
      duration: 0.15,
      ease: "power3.out",
    });
    const moveDotY = gsap.quickTo(dotElement, "y", {
      duration: 0.15,
      ease: "power3.out",
    });
    const moveRing = gsap.quickTo(ringElement, "x", {
      duration: RING_TRAIL_DURATION,
      ease: "power3.out",
    });
    const moveRingY = gsap.quickTo(ringElement, "y", {
      duration: RING_TRAIL_DURATION,
      ease: "power3.out",
    });
    const resizeRing = gsap.quickTo(ringElement, "width", {
      duration: 0.35,
      ease: "power3.out",
    });
    const resizeRingHeight = gsap.quickTo(ringElement, "height", {
      duration: 0.35,
      ease: "power3.out",
    });

    let isHoveringInteractive = false;
    let trackedPointerX = -1;
    let trackedPointerY = -1;
    let activeHoverTarget: HTMLElement | null = null;

    const setRingSize = (size: number): void => {
      resizeRing(size);
      resizeRingHeight(size);
    };

    const applyPointerPosition = (x: number, y: number): void => {
      trackedPointerX = x;
      trackedPointerY = y;
      storePointerPosition({ x, y });
      moveDot(x);
      moveDotY(y);
      moveRing(x);
      moveRingY(y);
    };

    const setActiveHoverTarget = (target: HTMLElement | null): void => {
      if (activeHoverTarget === target) {
        return;
      }

      activeHoverTarget?.removeAttribute(CURSOR_HOVER_ATTRIBUTE);
      activeHoverTarget = target;
      activeHoverTarget?.setAttribute(CURSOR_HOVER_ATTRIBUTE, "true");
    };

    const updateHoverState = (x: number, y: number): void => {
      if (x < 0 || y < 0) {
        return;
      }

      const { hoverTarget, interactiveTarget } = resolveHoverTargets(x, y);
      const isInteractive = interactiveTarget !== null;

      setActiveHoverTarget(hoverTarget);

      if (isInteractive === isHoveringInteractive) {
        return;
      }

      isHoveringInteractive = isInteractive;
      setRingSize(isInteractive ? RING_SIZE_HOVER : RING_SIZE_DEFAULT);
    };

    const handlePointerUpdate = (event: PointerEvent | MouseEvent): void => {
      gsap.set([dotElement, ringElement], { autoAlpha: 1 });
      applyPointerPosition(event.clientX, event.clientY);
      updateHoverState(event.clientX, event.clientY);
    };

    const syncHoverFromTrackedPointer = (): void => {
      if (trackedPointerX < 0 || trackedPointerY < 0) {
        return;
      }

      updateHoverState(trackedPointerX, trackedPointerY);
    };

    const pointerListenerOptions: AddEventListenerOptions = {
      capture: true,
      passive: true,
    };

    window.addEventListener(
      "pointermove",
      handlePointerUpdate,
      pointerListenerOptions,
    );
    window.addEventListener(
      "pointerdown",
      handlePointerUpdate,
      pointerListenerOptions,
    );
    window.addEventListener(
      "pointerover",
      handlePointerUpdate,
      pointerListenerOptions,
    );
    window.addEventListener(
      "mousemove",
      handlePointerUpdate,
      pointerListenerOptions,
    );

    const unregisterScrollHoverSync = registerScrollHoverSync(
      syncHoverFromTrackedPointer,
    );

    if (storedPosition) {
      gsap.set([dotElement, ringElement], {
        x: storedPosition.x,
        y: storedPosition.y,
      });
      trackedPointerX = storedPosition.x;
      trackedPointerY = storedPosition.y;
      syncHoverFromTrackedPointer();
    }

    const bootstrapFrame = requestAnimationFrame((): void => {
      if (trackedPointerX < 0 || trackedPointerY < 0) {
        return;
      }

      applyPointerPosition(trackedPointerX, trackedPointerY);
      syncHoverFromTrackedPointer();
    });

    return (): void => {
      cancelAnimationFrame(bootstrapFrame);
      unregisterScrollHoverSync();
      setActiveHoverTarget(null);
      window.removeEventListener("pointermove", handlePointerUpdate, true);
      window.removeEventListener("pointerdown", handlePointerUpdate, true);
      window.removeEventListener("pointerover", handlePointerUpdate, true);
      window.removeEventListener("mousemove", handlePointerUpdate, true);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        data-custom-cursor="true"
        className="pointer-events-none fixed left-0 top-0 z-100 hidden rounded-full bg-white mix-blend-difference md:block"
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        data-custom-cursor="true"
        className="pointer-events-none fixed left-0 top-0 z-100 hidden h-2 w-2 rounded-full bg-white mix-blend-difference md:block"
        aria-hidden="true"
      />
    </>
  );
}

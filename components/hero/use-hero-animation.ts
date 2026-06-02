"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";
import { prefersReducedMotion } from "@/lib/animation";
import {
  appendHeroEntranceTimeline,
  revealHeroImmediately,
} from "@/lib/hero/create-hero-entrance-timeline";
import { PRELOADER_PARTS } from "@/lib/preloader/constants";
import {
  appendPreloaderTimeline,
  skipPreloader,
} from "@/lib/preloader/create-preloader-timeline";
import { shouldPlayInitialPreloader } from "@/lib/preloader/preloader-state";

function getPreloaderRoot(scope: HTMLElement): HTMLElement | null {
  const preloaderRoot: Element | null = scope.querySelector(
    `[data-preloader="${PRELOADER_PARTS.root}"]`,
  );

  return preloaderRoot instanceof HTMLElement ? preloaderRoot : null;
}

export function useHeroAnimation(
  sectionRef: RefObject<HTMLElement | null>,
): void {
  useGSAP(
    (): void => {
      const section: HTMLElement | null = sectionRef.current;

      if (!section) {
        return;
      }

      const preloaderRoot: HTMLElement | null = getPreloaderRoot(section);
      const shouldPlayPreloader: boolean = preloaderRoot
        ? shouldPlayInitialPreloader()
        : false;

      if (prefersReducedMotion()) {
        if (preloaderRoot) {
          skipPreloader(preloaderRoot, { resetScroll: shouldPlayPreloader });
        }

        revealHeroImmediately(section);
        return;
      }

      const timeline: gsap.core.Timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      if (preloaderRoot) {
        if (shouldPlayPreloader) {
          appendPreloaderTimeline({
            scope: preloaderRoot,
            timeline,
          });
        } else {
          skipPreloader(preloaderRoot, { resetScroll: false });
        }
      }

      appendHeroEntranceTimeline({
        scope: section,
        timeline,
        position: shouldPlayPreloader ? "-=0.55" : 0,
      });
    },
    { scope: sectionRef },
  );
}

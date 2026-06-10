"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ScrollTrigger as ScrollTriggerPlugin } from "gsap/ScrollTrigger";
import { RefObject } from "react";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/animation";

/** Play when entering from above or below after the section fully left the viewport. */
export const SECTION_REPLAY_TOGGLE_ACTIONS = "play none play none" as const;

export const SECTION_EXIT_START = "top bottom" as const;
export const SECTION_EXIT_END = "bottom top" as const;

export interface ScrollRevealConfig {
  selector: string;
  y?: number;
  yPercent?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  trigger?: string | Element | null;
  ease?: string;
  once?: boolean;
}

export function attachSectionExitReset(
  section: HTMLElement | null,
  animation: gsap.core.Animation,
): ScrollTriggerPlugin | undefined {
  if (!section) {
    return undefined;
  }

  const ScrollTrigger = registerScrollTrigger();
  const resetAnimation = (): void => {
    animation.progress(0).pause();
  };

  return ScrollTrigger.create({
    trigger: section,
    start: SECTION_EXIT_START,
    end: SECTION_EXIT_END,
    onLeave: resetAnimation,
    onLeaveBack: resetAnimation,
  });
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  configs: ScrollRevealConfig | ScrollRevealConfig[],
): void {
  useGSAP(
    (): void => {
      const configArray = Array.isArray(configs) ? configs : [configs];

      if (prefersReducedMotion()) {
        configArray.forEach((config) => {
          gsap.set(config.selector, {
            opacity: 1,
            y: 0,
            yPercent: 0,
            clearProps: "filter,transform",
          });
        });
        return;
      }

      registerScrollTrigger();

      configArray.forEach((config) => {
        // Default to y: 40 if neither y nor yPercent are specified
        const initialY =
          config.y !== undefined
            ? config.y
            : config.yPercent !== undefined
              ? 0
              : 40;

        const playOnce = config.once ?? false;
        const animation = gsap.fromTo(
          config.selector,
          {
            y: initialY,
            yPercent: config.yPercent ?? 0,
            opacity: 0,
          },
          {
            y: 0,
            yPercent: 0,
            opacity: 1,
            duration: config.duration ?? 1,
            stagger: config.stagger ?? 0,
            ease: config.ease ?? "power4.out",
            scrollTrigger: {
              trigger: config.trigger || ref.current,
              start: config.start ?? "top 75%",
              once: playOnce,
              toggleActions: playOnce
                ? "play none none none"
                : SECTION_REPLAY_TOGGLE_ACTIONS,
            },
          },
        );

        if (!playOnce) {
          attachSectionExitReset(ref.current, animation);
        }
      });
    },
    { scope: ref },
  );
}

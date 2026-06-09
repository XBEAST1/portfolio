"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { RefObject } from "react";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/animation";

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

        gsap.fromTo(
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
              once: config.once ?? false,
              toggleActions: "play none none none",
            },
          },
        );
      });
    },
    { scope: ref },
  );
}

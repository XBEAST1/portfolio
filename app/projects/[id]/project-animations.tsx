"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";
import { Preloader } from "@/components/preloader";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/animation";
import { mediaQueryLg } from "@/lib/breakpoints";
import { navbarBrandName, roleTitle, location } from "@/lib/portfolio-data";
import { PRELOADER_PARTS } from "@/lib/preloader/constants";
import {
  appendPreloaderTimeline,
  skipPreloader,
} from "@/lib/preloader/create-preloader-timeline";
import { shouldPlayInitialPreloader } from "@/lib/preloader/preloader-state";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

interface ProjectCaseStudyShellProps {
  readonly children: ReactNode;
}

interface SplitParallaxOptions {
  readonly trigger: HTMLElement;
  readonly indexContent: HTMLElement;
  readonly mediaElement: HTMLElement;
  readonly indexTravelRatio: number;
  readonly mediaDropRatio: number;
  readonly mediaDropCap: number;
}

function applySplitColumnParallax({
  trigger,
  indexContent,
  mediaElement,
  indexTravelRatio,
  mediaDropRatio,
  mediaDropCap,
}: SplitParallaxOptions): void {
  const getFullSpan = (): number =>
    Math.max(mediaElement.offsetHeight - indexContent.offsetHeight, 0);

  const getIndexTravel = (): number => getFullSpan() * indexTravelRatio;

  const getMediaDrop = (): number =>
    Math.min(getFullSpan() * mediaDropRatio, mediaDropCap);

  gsap.set(indexContent, { y: 0 });
  gsap.set(mediaElement, { y: 0 });

  gsap.to(indexContent, {
    y: () => -getIndexTravel(),
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.65,
      invalidateOnRefresh: true,
    },
  });

  gsap.to(mediaElement, {
    y: () => getMediaDrop(),
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "top top",
      scrub: 0.2,
      invalidateOnRefresh: true,
    },
  });
}

export function ProjectCaseStudyShell({
  children,
}: ProjectCaseStudyShellProps): React.ReactElement {
  const pageRef = useRef<HTMLElement | null>(null);

  useScrollReveal(pageRef, [
    {
      selector: ".case-hero-anim",
      y: 42,
      stagger: 0.08,
      start: "top 82%",
    },
    {
      selector: ".case-reveal",
      y: 46,
      stagger: 0.1,
      start: "top 78%",
    },
    {
      selector: ".case-image",
      y: 60,
      stagger: 0.14,
      start: "top 82%",
    },
  ]);

  useGSAP(
    (): void => {
      const page = pageRef.current;
      if (!page) return;

      const preloaderRoot = page.querySelector<HTMLElement>(
        `[data-preloader="${PRELOADER_PARTS.root}"]`,
      );

      if (preloaderRoot) {
        if (prefersReducedMotion() || !shouldPlayInitialPreloader()) {
          skipPreloader(preloaderRoot, { resetScroll: false });
        } else {
          appendPreloaderTimeline({ scope: preloaderRoot });
        }
      }

      if (prefersReducedMotion()) {
        return;
      }

      const ScrollTrigger = registerScrollTrigger();

      const heroFrame =
        pageRef.current?.querySelector<HTMLElement>(".case-hero-frame");
      const heroCopy =
        pageRef.current?.querySelector<HTMLElement>(".case-hero-copy");

      const galleryFigures = gsap.utils.toArray<HTMLElement>(
        ".case-image",
        pageRef.current,
      );

      const desktopParallax = gsap.matchMedia();

      desktopParallax.add(mediaQueryLg, () => {
        if (heroFrame && heroCopy) {
          const getHeroCopyLift = (): number =>
            Math.min(heroFrame.offsetHeight * 0.2, 100);

          gsap.set(heroCopy, { y: 0 });

          gsap.to(heroCopy, {
            y: () => -getHeroCopyLift(),
            ease: "none",
            scrollTrigger: {
              trigger: pageRef.current,
              start: "top top",
              end: () => `+=${heroFrame.offsetHeight}`,
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
        }

        galleryFigures.forEach((figure) => {
          const indexColumn = figure.querySelector<HTMLElement>(
            ".case-gallery-index",
          );
          const indexContent = figure.querySelector<HTMLElement>(
            ".case-gallery-index-content",
          );
          const mediaElement = figure.querySelector<HTMLElement>(
            ".case-gallery-media",
          );

          if (!indexColumn || !indexContent || !mediaElement) {
            return;
          }

          applySplitColumnParallax({
            trigger: figure,
            indexContent,
            mediaElement,
            indexTravelRatio: 1,
            mediaDropRatio: 0.4,
            mediaDropCap: 80,
          });
        });

        const sectionBlocks = gsap.utils.toArray<HTMLElement>(
          ".case-section-parallax",
          pageRef.current,
        );

        sectionBlocks.forEach((sectionBlock) => {
          const indexColumn = sectionBlock.querySelector<HTMLElement>(
            ".case-section-index",
          );
          const indexContent = sectionBlock.querySelector<HTMLElement>(
            ".case-section-index-content",
          );
          const mediaElement = sectionBlock.querySelector<HTMLElement>(
            ".case-section-media",
          );

          if (!indexColumn || !indexContent || !mediaElement) {
            return;
          }

          applySplitColumnParallax({
            trigger: sectionBlock,
            indexContent,
            mediaElement,
            indexTravelRatio: 0.15,
            mediaDropRatio: 0.4,
            mediaDropCap: 80,
          });
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: pageRef },
  );

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      <Preloader
        brandName={navbarBrandName}
        roleTitle={roleTitle}
        location={location}
      />
      {children}
    </main>
  );
}

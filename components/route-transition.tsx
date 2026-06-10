"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { scheduleScrollLayoutRefresh } from "@/lib/animation";
import { lockPageScroll, unlockPageScroll } from "@/lib/lock-scroll";
import { navbarBrandName } from "@/lib/portfolio-data";
import { resetScrollToTop } from "@/lib/preloader/reset-scroll-to-top";
import { markSpaNavigationOccurred } from "@/lib/preloader/preloader-state";

const INTERNAL_TRANSITION_ATTRIBUTE = "data-route-transition";

function getTransitionLabel(url: URL): string {
  if (url.pathname === "/") {
    return url.hash ? "Portfolio / Section" : "Portfolio";
  }

  if (url.pathname.startsWith("/projects/")) {
    return "Case Study";
  }

  return "Loading";
}

function isPlainLeftClick(event: MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function getClosestAnchor(
  target: EventTarget | null,
): HTMLAnchorElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  return target.closest("a[href]");
}

function isSamePathNavigation(destination: URL): boolean {
  return destination.pathname === window.location.pathname;
}

function shouldHandleNavigation(
  event: MouseEvent,
  anchor: HTMLAnchorElement,
): boolean {
  if (!isPlainLeftClick(event)) {
    return false;
  }

  if (
    anchor.target ||
    anchor.download ||
    anchor.hasAttribute(INTERNAL_TRANSITION_ATTRIBUTE)
  ) {
    return false;
  }

  const destination = new URL(anchor.href);

  if (destination.origin !== window.location.origin) {
    return false;
  }

  if (isSamePathNavigation(destination)) {
    return false;
  }

  return true;
}

export function RouteTransition(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const topPanelRef = useRef<HTMLDivElement | null>(null);
  const bottomPanelRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const leftCornerRef = useRef<HTMLDivElement | null>(null);
  const rightCornerRef = useRef<HTMLDivElement | null>(null);
  const ruleRef = useRef<HTMLDivElement | null>(null);

  const ENTRANCE_HOLD_DURATION = 1;
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingDestinationRef = useRef<string | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const [transitionLabel, setTransitionLabel] = useState<string>("Portfolio");

  useGSAP(
    (): void => {
      gsap.set(rootRef.current, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(topPanelRef.current, { yPercent: -105 });
      gsap.set(bottomPanelRef.current, { yPercent: 105 });
      gsap.set(contentRef.current, {
        autoAlpha: 0,
        y: 28,
        filter: "blur(8px)",
      });
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set([leftCornerRef.current, rightCornerRef.current], {
        y: 20,
        opacity: 0,
      });
    },
    { scope: rootRef },
  );

  useEffect((): (() => void) => {
    const handleClick = (event: MouseEvent): void => {
      const anchor = getClosestAnchor(event.target);

      if (!anchor || !shouldHandleNavigation(event, anchor)) {
        return;
      }

      event.preventDefault();

      if (isTransitioningRef.current) {
        return;
      }

      const destination = new URL(anchor.href);
      const href = `${destination.pathname}${destination.search}${destination.hash}`;

      pendingDestinationRef.current = href;
      isTransitioningRef.current = true;
      lockPageScroll();
      markSpaNavigationOccurred();
      setTransitionLabel(getTransitionLabel(destination));
      activeTimelineRef.current?.kill();

      const timeline = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: (): void => {
          if (!destination.hash) {
            resetScrollToTop();
          }

          router.push(href, { scroll: true });
        },
      });

      activeTimelineRef.current = timeline;

      timeline
        .set(rootRef.current, { autoAlpha: 1, pointerEvents: "auto" })
        .set(topPanelRef.current, { yPercent: -105 })
        .set(bottomPanelRef.current, { yPercent: 105 })
        .set(contentRef.current, {
          autoAlpha: 0,
          y: 28,
          filter: "blur(8px)",
        })
        .set(ruleRef.current, { scaleX: 0, transformOrigin: "left center" })
        .set([leftCornerRef.current, rightCornerRef.current], {
          y: 20,
          opacity: 0,
        })
        .to([topPanelRef.current, bottomPanelRef.current], {
          yPercent: 0,
          duration: 0.78,
        })
        .to(
          contentRef.current,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.58,
            ease: "power4.out",
          },
          "-=0.42",
        )
        .to(
          ruleRef.current,
          {
            scaleX: 1,
            duration: 0.72,
            ease: "power3.inOut",
          },
          "-=0.48",
        )
        .to(
          [leftCornerRef.current, rightCornerRef.current],
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.45",
        )
        .to({}, { duration: ENTRANCE_HOLD_DURATION });
    };

    document.addEventListener("click", handleClick, true);

    return (): void => {
      document.removeEventListener("click", handleClick, true);
      activeTimelineRef.current?.kill();
    };
  }, [router]);

  useEffect((): void => {
    if (!pendingDestinationRef.current) {
      return;
    }

    pendingDestinationRef.current = null;
    activeTimelineRef.current?.kill();

    const reveal = (): void => {
      const timeline = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: (): void => {
          isTransitioningRef.current = false;
          unlockPageScroll({ restoreScroll: false });
          scheduleScrollLayoutRefresh();
        },
      });

      activeTimelineRef.current = timeline;

      timeline
        .to(contentRef.current, {
          autoAlpha: 0,
          y: -22,
          filter: "blur(8px)",
          duration: 0.36,
          ease: "power3.in",
        })
        .to(
          ruleRef.current,
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.42,
            ease: "power3.inOut",
          },
          "<",
        )
        .to(
          topPanelRef.current,
          {
            yPercent: -105,
            duration: 0.92,
          },
          "-=0.02",
        )
        .to(
          bottomPanelRef.current,
          {
            yPercent: 105,
            duration: 0.92,
          },
          "<",
        )
        .set(rootRef.current, { autoAlpha: 0, pointerEvents: "none" });
    };

    window.requestAnimationFrame((): void => {
      window.requestAnimationFrame(reveal);
    });
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-100 overflow-hidden text-white opacity-0"
      aria-hidden="true"
    >
      <div
        ref={topPanelRef}
        className="absolute inset-x-0 top-0 z-20 h-1/2 bg-[#050505]"
      >
        <div className="absolute inset-0 bg-noise opacity-[0.12]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#fde8bf]/50 to-transparent" />
      </div>

      <div
        ref={bottomPanelRef}
        className="absolute inset-x-0 bottom-0 z-20 h-1/2 bg-[#050505]"
      >
        <div className="absolute inset-0 bg-noise opacity-[0.12]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#fde8bf]/50 to-transparent" />
        <div
          ref={leftCornerRef}
          className="absolute bottom-8 left-8 z-10 translate-y-5 opacity-0"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
            Route Shift
          </p>
        </div>
        <div
          ref={rightCornerRef}
          className="absolute bottom-8 right-8 z-10 translate-y-5 opacity-0"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
            Smooth Handoff
          </p>
        </div>
      </div>

      <div
        ref={contentRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fde8bf]/10 blur-[120px]" />

        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.55em] text-[#fde8bf]">
          {transitionLabel}
        </p>

        <div className="relative">
          <p className="pointer-events-none absolute inset-0 select-none font-heading text-[24vw] font-black uppercase leading-none tracking-tighter text-white/5 md:text-[12vw]">
            {navbarBrandName}
          </p>
          <p className="relative font-heading text-[24vw] font-black uppercase leading-none tracking-tighter text-white md:text-[12vw]">
            {navbarBrandName}
          </p>
        </div>

        <div className="mt-9 w-full max-w-xs">
          <div className="mb-4 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.35em]">
            <span className="text-gray-500">Loading route</span>
            <span className="text-[#fde8bf]">100</span>
          </div>
          <div className="h-px overflow-hidden bg-white/10">
            <div
              ref={ruleRef}
              className="h-full w-full bg-linear-to-r from-[#fde8bf] via-white to-[#fde8bf]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

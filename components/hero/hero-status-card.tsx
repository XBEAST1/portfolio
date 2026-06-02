"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contactSectionHref, heroStatusSlides } from "@/lib/portfolio-data";

const ROTATION_INTERVAL_MS: number = 3000;

export function HeroStatusCard(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect((): (() => void) => {
    const intervalId: number = window.setInterval((): void => {
      setActiveIndex(
        (currentIndex: number): number =>
          (currentIndex + 1) % heroStatusSlides.length,
      );
    }, ROTATION_INTERVAL_MS);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, []);

  const activeSlide = heroStatusSlides[activeIndex];

  return (
    <div className="bento-item h-full min-h-0">
      <Link
        href={contactSectionHref}
        className="group flex h-full min-h-0 flex-col justify-between rounded-4xl border border-white/10 bg-[#0a0a0a] p-5 md:p-6 text-white transition-all duration-500 hover:border-[#fde8bf]/50 hover:bg-[#fde8bf]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider">
            <span className="text-gray-500 group-hocus:hidden">
              CURRENT STATUS
            </span>
            <span className="hidden text-[#fde8bf] group-hocus:inline">
              PRIORITY ACCESS
            </span>
          </p>

          <div className="relative h-2 w-2 shrink-0">
            <div className="absolute inset-0 rounded-full bg-yellow-500 shadow-[0_0_10px_currentColor] transition-opacity duration-300 group-hocus:opacity-0">
              <div className="h-full w-full animate-pulse rounded-full bg-yellow-500" />
            </div>
            <div className="absolute inset-0 scale-150 rounded-full bg-[#fde8bf] opacity-0 group-hocus:animate-ping group-hocus:opacity-75" />
            <div className="absolute inset-0 rounded-full bg-[#fde8bf] opacity-0 shadow-[0_0_10px_#22c55e] transition-opacity duration-300 group-hocus:opacity-100" />
          </div>
        </div>

        <div>
          <div className="group-hocus:hidden">
            <h2 className="mb-1 font-mono text-xl font-light text-white md:text-2xl lg:text-3xl">
              {activeSlide.headline}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {activeSlide.label}
            </p>
          </div>

          <div className="hidden group-hocus:block">
            <h2 className="mb-1 font-mono text-xl font-light text-white md:text-2xl lg:text-3xl">
              READY FOR YOU.
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fde8bf]">
              CLICK TO HIRE
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

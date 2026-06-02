"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { HeroStatusCard } from "@/components/hero/hero-status-card";
import { useHeroAnimation } from "@/components/hero/use-hero-animation";
import { HoverFill } from "@/components/hover-fill";
import { Preloader } from "@/components/preloader";
import DP from "@/app/assets/dp.jpg";
import {
  aboutSectionHref,
  contactSectionHref,
  displayName,
  heroStackLabel,
  heroStackTags,
  location,
  navbarBrandName,
  resumePdfHref,
  roleTitle,
} from "@/lib/portfolio-data";

export function Hero(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);

  useHeroAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-[#050505] p-3 pt-30 text-white md:p-6 md:pt-30"
    >
      <Preloader
        brandName={navbarBrandName}
        roleTitle={roleTitle}
        location={location}
      />

      <div className="pointer-events-none absolute inset-0 z-0 bg-noise opacity-20" />

      <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-450 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 md:grid-cols-12 md:grid-rows-1 md:gap-4">
        <div className="flex min-h-0 flex-col gap-3 md:col-span-7 md:h-full md:gap-4">
          <div className="bento-item group relative flex shrink-0 flex-col gap-4 rounded-4xl border border-white/10 bg-white/5 p-4 sm:min-h-0 sm:flex-1 sm:justify-between sm:gap-0 sm:overflow-hidden sm:p-5 md:p-8 lg:p-10">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
              <div className="rounded-full border border-white/20 bg-black/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md sm:px-3 sm:text-[10px]">
                <span className="sm:hidden">{navbarBrandName} / Dev</span>
                <span className="hidden sm:inline">{displayName} / Dev</span>
              </div>
              <HoverFill
                as="a"
                href={resumePdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-white/20 bg-transparent px-3 py-2 transition-all duration-300 hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf] sm:px-5 sm:py-2.5"
                contentClassName="gap-1 text-[9px] font-bold uppercase tracking-widest text-white transition-colors duration-500 group-hocus:text-black sm:gap-2 sm:text-xs"
              >
                View Resume
                <ArrowUpRight
                  className="h-3 w-3 transition-transform group-hocus:-translate-y-0.5 group-hocus:translate-x-0.5 sm:h-3.5 sm:w-3.5"
                  aria-hidden="true"
                />
              </HoverFill>
            </div>

            <div className="min-w-0 sm:mt-4 md:mt-6">
              <h1 className="font-heading text-[clamp(1.75rem,7vw,2.75rem)] font-black uppercase leading-[0.92] tracking-tighter text-white mix-blend-overlay sm:text-[clamp(2.25rem,6vw,3.5rem)] md:text-[5vw] md:leading-[0.85] lg:text-[4.5vw]">
                {displayName.split(" ").map(
                  (word: string): React.ReactElement => (
                    <span key={word} className="block">
                      {word.split("").map(
                        (
                          character: string,
                          index: number,
                        ): React.ReactElement => (
                          <span
                            key={`${word}-${character}-${index}`}
                            className="inline-block overflow-hidden align-bottom"
                          >
                            <span className="char-reveal inline-block origin-bottom pb-0.5 sm:pb-1">
                              {character}
                            </span>
                          </span>
                        ),
                      )}
                    </span>
                  ),
                )}
              </h1>
              <p className="mt-2 max-w-lg text-[10px] uppercase leading-relaxed tracking-[0.12em] text-gray-400 sm:mt-3 sm:text-xs sm:tracking-[0.25em] md:mt-4 md:text-sm md:tracking-[0.35em] lg:text-base">
                {roleTitle} building scalable SaaS platforms, RAG pipelines, and
                zero-knowledge AI systems.
              </p>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 md:h-36 lg:h-40">
            <HeroStatusCard />

            <div className="bento-item relative flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-white/10 bg-[#0a0a0a] p-5 md:p-6 transition-colors hover:border-white/30">
              <div className="absolute right-[-50%] top-[-50%] h-full w-full bg-purple-500/10 blur-[60px]" />
              <span className="font-mono text-[10px] uppercase text-gray-500">
                {heroStackLabel}
              </span>
              <div className="flex flex-wrap content-end gap-2">
                {heroStackTags.map(
                  (skill: string): React.ReactElement => (
                    <span
                      key={skill}
                      className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300"
                    >
                      {skill}
                    </span>
                  ),
                )}
                <Link
                  href={aboutSectionHref}
                  className="rounded bg-white px-2 py-1 text-xs font-bold text-black transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
                >
                  + More
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col md:col-span-5 md:h-full">
          <div className="bento-item relative min-h-0 flex-1 overflow-hidden rounded-4xl border border-white/10 bg-white/5">
            <div className="hero-img-inner absolute inset-0">
              <Image
                src={DP.src}
                alt={`Portrait of ${displayName}`}
                fill
                priority
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover grayscale transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
            <Link
              href={contactSectionHref}
              className="absolute bottom-6 left-6 rounded-lg border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
            >
              <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-300">
                Status
              </p>
              <p className="text-sm font-bold text-white">OPEN FOR WORK</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  HoverFillOverlay,
  HOVER_FILL_DURATION_CLASS,
  HOVER_FILL_EASING_CLASS,
} from "@/components/hover-fill";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/animation";
import { getProjectPath, projects } from "@/lib/portfolio-data";

import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Work(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useScrollReveal(sectionRef, [
    {
      selector: ".work-header-anim",
      y: 40,
      stagger: 0.08,
      start: "top 70%",
      once: false,
    },
    {
      selector: ".work-mobile-item",
      y: 40,
      stagger: 0.15,
      trigger: ".work-mobile-stack",
      start: "top 80%",
      once: false,
    },
  ]);

  useGSAP(
    (): void => {
      if (prefersReducedMotion()) {
        return;
      }

      const ScrollTrigger = registerScrollTrigger();

      const rows: Element[] = gsap.utils.toArray(".project-row");

      rows.forEach((row: Element, index: number): void => {
        ScrollTrigger.create({
          trigger: row,
          start: "top center",
          end: "bottom center",
          onEnter: (): void => setActiveIndex(index),
          onEnterBack: (): void => setActiveIndex(index),
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full bg-[#050505] py-24 text-white md:py-32"
    >
      <div className="container mx-auto px-6 md:px-10">
        <div className="mb-20 flex flex-col items-start justify-between border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div className="overflow-hidden">
            <h2 className="work-header-anim font-heading text-[10vw] font-black uppercase leading-[0.8] tracking-tighter text-white opacity-0 md:text-[6vw]">
              Selected
              <br />
              <span className="text-gray-600">Works</span>
            </h2>
          </div>
          <div className="mt-6 overflow-hidden md:mt-0">
            <div className="work-header-anim flex flex-col items-start opacity-0 md:items-end">
              <p className="mb-1 font-mono text-xs uppercase tracking-widest text-gray-400">
                Case Studies
              </p>
              <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-bold">
                {String(projects.length).padStart(2, "0")} PROJECTS
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden flex-row gap-12 md:flex lg:gap-20">
          <div className="flex w-[40%] flex-col pb-[50vh]">
            {projects.map((project, index: number): React.ReactElement => {
              const isActive: boolean = activeIndex === index;

              return (
                <Link
                  key={project.id}
                  href={getProjectPath(project.id)}
                  className={`project-row p-row-${index} flex min-h-[80vh] flex-col justify-center border-t border-white/10 transition-all duration-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf] ${
                    isActive ? "opacity-100 blur-0" : "opacity-20 blur-sm"
                  }`}
                  onMouseEnter={(): void => setActiveIndex(index)}
                >
                  <div className="mb-6 flex items-start justify-between">
                    <span
                      className={`font-mono text-sm transition-colors duration-300 ${
                        isActive ? "text-[#fde8bf]" : "text-gray-600"
                      }`}
                    >
                      {project.number}
                    </span>
                    <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-400">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="mb-6 font-heading text-5xl font-bold uppercase leading-none lg:text-7xl">
                    {project.title}
                  </h3>
                  <p className="mb-8 font-mono text-sm uppercase tracking-wide text-gray-500">
                    {project.stack}
                  </p>
                  <div
                    className={`h-0.5 w-full origin-left bg-[#fde8bf] transition-transform duration-700 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="sticky top-24 flex h-[75vh] flex-1 items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0a] p-8 md:p-16">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/50 shadow-2xl">
              {projects.map((project, index: number): React.ReactElement => {
                const isActive: boolean = activeIndex === index;

                return (
                  <Link
                    key={project.id}
                    href={getProjectPath(project.id)}
                    className={`absolute inset-0 block transition-all duration-1000 ease-in-out ${
                      isActive
                        ? "pointer-events-auto z-10 scale-100 opacity-100"
                        : "pointer-events-none z-0 scale-110 opacity-0"
                    }`}
                    aria-label={`View ${project.title} case study`}
                    tabIndex={isActive ? 0 : -1}
                  >
                    <div className="absolute inset-x-0 top-0 bottom-24">
                      <Image
                        src={project.image}
                        alt={`${project.title} project preview`}
                        fill
                        sizes="50vw"
                        className="object-contain"
                      />
                    </div>
                  </Link>
                );
              })}

              <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
                <Link
                  href={
                    projects[activeIndex]
                      ? getProjectPath(projects[activeIndex].id)
                      : "#work"
                  }
                  className="group relative pointer-events-auto flex items-center gap-3 overflow-hidden rounded-full border border-white/20 bg-white/10 px-8 py-4 text-white backdrop-blur-md"
                  data-scroll-hover=""
                  aria-label={`View ${projects[activeIndex]?.title} case study`}
                >
                  <HoverFillOverlay />
                  <span
                    className={`relative z-10 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS} group-hocus:text-black`}
                  >
                    View Case Study
                  </span>
                  <span
                    className={`relative z-10 text-sm transition-all group-hocus:-translate-y-1 group-hocus:translate-x-1 ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS} group-hocus:text-black`}
                  >
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="work-mobile-stack flex flex-col gap-16 pt-8 md:hidden">
          {projects.map(
            (project): React.ReactElement => (
              <Link
                key={project.id}
                href={getProjectPath(project.id)}
                className="work-mobile-item group flex flex-col gap-6 opacity-0"
                data-scroll-hover=""
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <Image
                    src={project.image}
                    alt={`${project.title} project preview`}
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hocus:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hocus:opacity-80" />
                  <div className="absolute bottom-5 right-5">
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 text-white">
                      <HoverFillOverlay />
                      <ArrowUpRight
                        className={`relative z-10 h-4 w-4 ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS} transition-colors group-hocus:text-black`}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col px-1">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <span className="font-mono text-xs text-[#fde8bf]">
                      {project.number}
                    </span>
                    <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-400">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-3xl font-bold uppercase leading-none">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-wide text-gray-500">
                    {project.stack}
                  </p>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

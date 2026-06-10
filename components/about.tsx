"use client";

import { useRef } from "react";
import { SectionMarquee } from "@/components/section-marquee";
import { philosophyItems } from "@/lib/portfolio-data";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

function getPhilosophyItemLayoutClass(index: number): string {
  const tabletColumn = index % 2;
  const desktopColumn = index % 3;

  const classes: string[] = [];

  if (tabletColumn === 0) {
    classes.push("sm:pr-10");
  } else {
    classes.push("sm:border-l sm:border-white/10 sm:pl-10");
  }

  if (desktopColumn === 0) {
    classes.push("md:pr-8 md:pl-0 md:border-l-0");
  } else {
    classes.push("md:border-l md:border-white/10 md:pl-10 md:pr-0");
  }

  return classes.join(" ");
}

export function About(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);

  useScrollReveal(sectionRef, [
    {
      selector: ".manifesto-line h2",
      yPercent: 110,
      stagger: 0.12,
    },
    {
      selector: ".philosophy-item",
      y: 40,
      duration: 0.9,
      stagger: 0.12,
      start: "top 70%",
    },
  ]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-heavy relative w-full overflow-hidden border-t border-white/10 bg-[#050505] py-24 text-white md:py-40"
    >
      <SectionMarquee />
      <div
        data-scroll-anchor
        className="portfolio-section-container relative z-10 pt-20 px-6 md:px-10"
      >
        <div className="manifesto-wrap mb-24">
          <div className="manifesto-line mb-2 overflow-hidden">
            <h2 className="inline-block origin-bottom font-heading text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-white md:text-[8vw]">
              Building
            </h2>
          </div>
          <div className="manifesto-line mb-2 overflow-hidden">
            <h2 className="text-stroke-white inline-block origin-bottom font-heading text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent md:text-[8vw]">
              Intelligent
            </h2>
          </div>
          <div className="manifesto-line overflow-hidden">
            <h2 className="inline-block origin-bottom bg-linear-to-r from-white via-gray-300 to-gray-600 bg-clip-text font-heading text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent md:text-[8vw]">
              Systems.
            </h2>
          </div>
        </div>

        <div className="philosophy-grid grid grid-cols-1 gap-8 border-t border-white/10 pt-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-y-16">
          {philosophyItems.map(
            (item, index: number): React.ReactElement => (
              <article
                key={item.eyebrow}
                className={`philosophy-item group cursor-default ${getPhilosophyItemLayoutClass(index)}`}
              >
                <span className="mb-4 block font-mono text-xs text-[#fde8bf]">
                  {item.eyebrow}
                </span>
                <h3 className="mb-4 whitespace-pre-line font-heading text-3xl font-bold uppercase text-gray-300 transition-colors duration-300 group-hocus:text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 transition-colors duration-300 group-hocus:text-gray-400 md:max-w-xs">
                  {item.description}
                </p>
                <div className="mt-8 h-px w-full origin-left scale-x-0 bg-white/10 transition-all duration-500 group-hocus:scale-x-100 group-hocus:bg-[#fde8bf]" />
              </article>
            ),
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"
        aria-hidden="true"
      />
    </section>
  );
}

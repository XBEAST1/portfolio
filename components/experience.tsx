"use client";

import { useRef } from "react";
import { SectionMarquee } from "@/components/section-marquee";
import { experiences } from "@/lib/portfolio-data";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Experience(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);

  useScrollReveal(sectionRef, [
    {
      selector: ".experience-line h2",
      yPercent: 110,
      stagger: 0.12,
    },
    {
      selector: ".experience-item",
      y: 40,
      duration: 0.9,
      stagger: 0.12,
      start: "top 70%",
    },
  ]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section-heavy relative w-full overflow-hidden border-t border-white/10 bg-[#050505] py-24 text-white md:py-40"
    >
      <SectionMarquee />
      <div
        data-scroll-anchor
        className="portfolio-section-container relative z-10 pt-20 px-6 md:px-10"
      >
        <div className="experience-wrap mb-24">
          <div className="experience-line mb-2 overflow-hidden">
            <h2 className="inline-block origin-bottom font-heading text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-white md:text-[8vw]">
              Years Of
            </h2>
          </div>
          <div className="experience-line mb-2 overflow-hidden">
            <h2 className="text-stroke-white inline-block origin-bottom font-heading text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent md:text-[8vw]">
              Professional
            </h2>
          </div>
          <div className="experience-line overflow-hidden">
            <h2 className="inline-block origin-bottom bg-linear-to-r from-white via-gray-300 to-gray-600 bg-clip-text font-heading text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent md:text-[8vw]">
              Experience.
            </h2>
          </div>
        </div>

        <div className="experience-list flex flex-col gap-16 border-t border-white/10 pt-12">
          {experiences.map(
            (experience, index: number): React.ReactElement => (
              <article
                key={experience.company}
                className={`experience-item group ${
                  index < experiences.length - 1
                    ? "border-b border-white/10 pb-16"
                    : ""
                }`}
              >
                <span className="mb-4 block font-mono text-xs text-[#fde8bf]">
                  {experience.number}
                  {" /// "}
                  {experience.period.toUpperCase()}
                </span>
                <h3 className="mb-2 font-heading text-3xl font-bold uppercase text-gray-300 transition-colors duration-300 group-hocus:text-white md:text-4xl">
                  {experience.role}
                </h3>
                <p className="mb-8 font-mono text-sm uppercase tracking-wider text-gray-500">
                  {experience.company}
                </p>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-12">
                  {experience.highlights.map(
                    (highlight: string): React.ReactElement => (
                      <li
                        key={highlight}
                        className="flex gap-3 text-sm leading-relaxed text-gray-500 transition-colors duration-300 group-hocus:text-gray-400"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#fde8bf]"
                          aria-hidden="true"
                        />
                        {highlight}
                      </li>
                    ),
                  )}
                </ul>
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

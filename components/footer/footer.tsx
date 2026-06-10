"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/animation";
import { mediaQueryMd } from "@/lib/breakpoints";
import { displayName, location, roleTitle } from "@/lib/portfolio-data";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const nameWords: readonly string[] = displayName.toUpperCase().split(" ");

export function Footer(): React.ReactElement {
  const footerRef = useRef<HTMLElement | null>(null);
  const currentYear: number = new Date().getFullYear();

  useScrollReveal(footerRef, [
    {
      selector: ".footer-heading-anim",
      yPercent: 110,
      stagger: 0.12,
      start: "top 85%",
      trigger: ".footer-heading-wrap",
    },
    {
      selector: ".footer-reveal",
      y: 40,
      stagger: 0.12,
      start: "top 85%",
    },
  ]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        return;
      }

      const ScrollTrigger = registerScrollTrigger();
      const mm = gsap.matchMedia();

      mm.add(mediaQueryMd, (): gsap.core.Tween => {
        return gsap.to(".footer-letter", {
          y: (index: number): number => {
            const direction: number = index % 2 === 0 ? -1 : 1;
            const amount: number = 30 + (index % 3) * 6;

            return direction * amount;
          },
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-heading-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 1440px)", (): gsap.core.Tween => {
        return gsap.to(".footer-letter", {
          y: (index: number): number => {
            const direction: number = index % 2 === 0 ? -1 : 1;
            const amount: number = 23 + (index % 3) * 2;

            return direction * amount;
          },
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-heading-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(max-width: 500px)", (): gsap.core.Tween => {
        return gsap.to(".footer-letter", {
          y: (index: number): number => {
            const direction: number = index % 2 === 0 ? -1 : 1;
            const amount: number = 7 + (index % 3) * 2;

            return direction * amount;
          },
          ease: "none",
          scrollTrigger: {
            trigger: ".footer-heading-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      ScrollTrigger.refresh();

      return (): void => mm.revert();
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="w-full border-t border-white/10 bg-[#050505] px-6 pb-10 pt-16 text-white md:px-10 md:pt-20"
    >
      <div className="footer-heading-wrap">
        {nameWords.map((word: string, index: number): React.ReactElement => {
          const isFirst: boolean = index === 0;
          const isLast: boolean = index === nameWords.length - 1;

          return (
            <div
              key={word}
              className={`${!isFirst ? "mt-[-0.2em] md:mt-[-0.45em]" : ""}`}
            >
              <h2
                className={`footer-heading-anim origin-bottom cursor-default select-none font-heading text-[11.5vw] font-black uppercase leading-[0.9] tracking-tight sm:text-[12.5vw] sm:leading-[0.88] sm:tracking-tighter md:text-[13.5vw] md:leading-[0.85] ${
                  isFirst ? "inline-block text-left" : "block w-full text-right"
                } ${isFirst ? "pt-[0.35em] pb-[0.25em]" : ""} ${
                  !isFirst && isLast ? "pt-[0.35em] pb-[0.35em]" : ""
                } ${!isFirst && !isLast ? "py-[0.35em]" : ""}`}
              >
                {word.split("").map(
                  (
                    character: string,
                    charIndex: number,
                  ): React.ReactElement => (
                    <span
                      key={`${word}-${charIndex}`}
                      className="footer-letter inline-block align-bottom"
                    >
                      {character}
                    </span>
                  ),
                )}
              </h2>
            </div>
          );
        })}
      </div>
      <div className="footer-reveal mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 opacity-0 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-500 md:text-xs">
          © {currentYear} {displayName}
        </p>
        <div className="flex flex-col gap-1 text-left md:items-end md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#fde8bf] md:text-xs">
            {roleTitle}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600 md:text-xs">
            {location}
          </p>
        </div>
      </div>
    </footer>
  );
}

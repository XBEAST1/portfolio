"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ContactSocialLinks } from "@/components/contact/contact-social-links";
import { HoverFill } from "@/components/hover-fill";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/animation";
import { emailMailtoHref } from "@/lib/portfolio-data";

import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Contact(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);

  useScrollReveal(sectionRef, [
    {
      selector: ".contact-heading-anim",
      yPercent: 110,
      stagger: 0.12,
      trigger: ".contact-heading-wrap",
    },
    {
      selector: ".contact-reveal",
      y: 40,
      stagger: 0.12,
    },
  ]);

  useGSAP(
    (): void => {
      if (prefersReducedMotion()) {
        gsap.set(".contact-line", { scaleX: 1 });
        return;
      }

      const ScrollTrigger = registerScrollTrigger();

      gsap.fromTo(
        ".contact-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power4.out",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: ".contact-line",
            start: "top 85%",
            once: true,
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full border-t border-white/10 bg-[#050505] px-6 py-24 text-white md:px-10 md:py-32"
    >
      <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:gap-0">
        <div className="max-w-3xl">
          <div className="contact-heading-wrap mb-8">
            <div className="overflow-hidden">
              <h2 className="contact-heading-anim inline-block origin-bottom font-heading text-[10vw] font-black uppercase leading-[0.85] tracking-tighter lg:text-[6vw]">
                LET&apos;S BUILD
              </h2>
            </div>
            <div className="overflow-hidden">
              <h2 className="contact-heading-anim inline-block origin-bottom font-heading text-[10vw] font-black uppercase leading-[0.85] tracking-tighter lg:text-[6vw]">
                <a
                  href={emailMailtoHref}
                  className="text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
                >
                  SOMETHING.
                </a>
              </h2>
            </div>
          </div>
          <p className="contact-reveal max-w-md text-lg font-light text-gray-400 opacity-0 md:text-xl">
            Open to freelance projects and new opportunities.
          </p>
          <div className="contact-reveal mt-8 flex flex-wrap items-center gap-4 opacity-0">
            <HoverFill
              as="link"
              href={emailMailtoHref}
              className="rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
              contentClassName="text-white transition-colors duration-500 group-hocus:text-black"
            >
              Email Me
            </HoverFill>
          </div>
        </div>

        <ContactSocialLinks />
      </div>
    </section>
  );
}

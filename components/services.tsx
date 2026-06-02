"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import {
  HoverFillOverlay,
  HOVER_FILL_DURATION_CLASS,
  HOVER_FILL_EASING_CLASS,
} from "@/components/hover-fill";
import { prefersReducedMotion, registerScrollTrigger } from "@/lib/animation";
import { services } from "@/lib/portfolio-data";
import {
  SERVICE_PANEL_EASE_CLASS,
  useServicePanels,
} from "@/lib/service-panels";

import { useScrollReveal } from "@/lib/use-scroll-reveal";

export function Services(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { listRef, setRowRef, onRowEnter, onListLeave, toggleService } =
    useServicePanels();

  useScrollReveal(sectionRef, {
    selector: ".service-header-anim",
    y: 40,
    stagger: 0.08,
    start: "top 70%",
    once: false,
  });

  useGSAP(
    (): void => {
      const rows = gsap.utils.toArray<HTMLElement>(".service-row");

      if (prefersReducedMotion()) {
        rows.forEach((row): void => {
          const button =
            row.querySelector<HTMLButtonElement>(".service-item-anim");
          const divider = row.querySelector<HTMLElement>(".service-divider");
          if (button) gsap.set(button, { clearProps: "transform" });
          if (divider) gsap.set(divider, { scaleX: 1 });
        });
        return;
      }

      registerScrollTrigger();

      rows.forEach((row, i): void => {
        const button =
          row.querySelector<HTMLButtonElement>(".service-item-anim");
        const divider = row.querySelector<HTMLElement>(".service-divider");
        const arrowWrap = row.querySelector<HTMLElement>(".service-arrow-wrap");

        if (button) gsap.set(button, { yPercent: 105 });
        if (divider) gsap.set(divider, { scaleX: 0 });
        if (arrowWrap) gsap.set(arrowWrap, { scale: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".services-list",
            start: "top 150%",
            toggleActions: "play none none reset",
          },
          delay: i * 0.1,
        });

        if (divider) {
          tl.to(divider, { scaleX: 1, duration: 1.0, ease: "power4.out" }, 0);
        }

        if (button) {
          tl.to(
            button,
            { yPercent: 0, duration: 0.75, ease: "power4.out" },
            0.05,
          );
        }

        if (arrowWrap) {
          tl.to(
            arrowWrap,
            { scale: 1, duration: 0.5, ease: "back.out(2)" },
            0.55,
          );
        }
      });
    },
    { scope: sectionRef },
  );

  useGSAP(
    (): void => {
      if (prefersReducedMotion()) {
        return;
      }

      const ScrollTrigger = registerScrollTrigger();

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: (): void => {
          gsap.to(document.body, { backgroundColor: "#0a0a0a" });
        },
        onLeaveBack: (): void => {
          gsap.to(document.body, { backgroundColor: "#050505" });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full bg-black px-4 py-24 text-white md:px-0 md:py-32"
    >
      <div className="container mx-auto px-4 md:px-10">
        <div className="mb-20 flex flex-col items-start justify-between border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div className="overflow-hidden">
            <h2 className="service-header-anim font-heading text-[10vw] font-black uppercase leading-[0.85] tracking-tighter text-white opacity-0 md:text-[6vw]">
              WHAT I
              <br />
              <span className="text-gray-600">OFFER</span>
            </h2>
          </div>
          <div className="mt-6 overflow-hidden md:mt-0">
            <p className="service-header-anim text-right font-mono text-xs uppercase tracking-widest text-gray-400 opacity-0">
              Skills & Services
            </p>
          </div>
        </div>

        <div
          ref={listRef}
          className="services-list flex flex-col"
          onMouseLeave={onListLeave}
        >
          {services.map((service, index: number): React.ReactElement => {
            const panelId: string = `service-panel-${service.number}`;
            const triggerId: string = `service-trigger-${service.number}`;

            return (
              <div
                key={service.title}
                ref={(element: HTMLDivElement | null): void => {
                  setRowRef(index, element);
                }}
                className="service-row group relative"
                onMouseEnter={(): void => onRowEnter(index)}
              >
                <div className="service-divider absolute bottom-0 left-0 h-px w-full origin-left bg-white/10" />
                <div className="overflow-hidden">
                  <button
                    id={triggerId}
                    type="button"
                    className="service-item-anim flex w-full cursor-pointer appearance-none flex-col justify-between bg-transparent py-10 text-left transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf] group-hocus:px-4 md:flex-row md:items-center"
                    aria-expanded={false}
                    aria-controls={panelId}
                    onClick={(): void => toggleService(index)}
                  >
                    <span className="flex items-baseline gap-6 md:gap-10">
                      <span className="font-mono text-sm text-gray-500 transition-colors group-hocus:text-[#fde8bf]">
                        {service.number}
                      </span>
                      <span className="font-heading text-4xl font-bold uppercase text-white transition-transform duration-500 group-hocus:translate-x-2 md:text-6xl">
                        {service.title}
                      </span>
                    </span>
                    <span className="service-arrow-wrap group/icon relative mt-4 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/20 text-white md:mt-0">
                      <HoverFillOverlay groupName="icon" />
                      <ArrowUpRight
                        data-service-arrow
                        className={`relative z-10 h-4 w-4 ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS} transition-colors group-hocus-icon:text-black`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </div>
                <div
                  id={panelId}
                  aria-labelledby={triggerId}
                  aria-hidden
                  className={`service-panel max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] ${SERVICE_PANEL_EASE_CLASS}`}
                >
                  <div className="grid grid-cols-1 gap-8 pb-10 md:grid-cols-2 md:pl-[120px]">
                    <p className="max-w-md text-lg font-light leading-relaxed text-gray-400 md:text-xl">
                      {service.description}
                    </p>
                    <div className="flex content-start flex-wrap gap-3">
                      {service.tags.map(
                        (tag: string): React.ReactElement => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-wider text-gray-300"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

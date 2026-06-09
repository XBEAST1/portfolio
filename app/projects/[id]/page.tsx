import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Footer } from "@/components/footer/footer";
import { HomeSectionHoverFill } from "@/components/home-section-hover-fill";
import { HomeSectionLink } from "@/components/home-section-link";
import { HoverFill } from "@/components/hover-fill";
import {
  contactSectionHref,
  getProjectById,
  projects,
  workSectionHref,
} from "@/lib/portfolio-data";
import { ProjectCaseStudyShell } from "./project-animations";

interface ProjectPageProps {
  readonly params: Promise<{
    readonly id: string;
  }>;
}

function getCaseStudyHeroTitleClass(title: string): string {
  const length = title.length;

  if (length > 20) {
    return "text-[11vw] md:text-[5vw] lg:text-[4.2vw]";
  }

  if (length > 14) {
    return "text-[13vw] md:text-[6vw] lg:text-[5.2vw]";
  }

  if (length > 10) {
    return "text-[15vw] md:text-[7vw] lg:text-[6vw]";
  }

  return "text-[17vw] md:text-[8vw] lg:text-[7.2vw]";
}

export function generateStaticParams(): { id: string }[] {
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata(
  props: ProjectPageProps,
): Promise<Metadata> {
  const { id } = await props.params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return {
    title: `${project.title} Case Study | Muhammad Hamza`,
    description: project.tagline,
  };
}

export default async function ProjectPage(
  props: ProjectPageProps,
): Promise<React.ReactElement> {
  const { id } = await props.params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <ProjectCaseStudyShell>
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-noise opacity-[0.035] mix-blend-overlay"
        aria-hidden="true"
      />

      <section className="relative z-10 px-6 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="case-hero-anim mb-10 opacity-0">
            <HomeSectionLink
              href={workSectionHref}
              data-scroll-hover=""
              className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-[#fde8bf]"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hocus:-translate-x-1"
                aria-hidden="true"
              />
              Back To Work
            </HomeSectionLink>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
            <div className="case-hero-copy min-w-0">
              <div className="case-hero-anim mb-8 flex flex-wrap items-center gap-3 opacity-0">
                <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#fde8bf]">
                  {project.number} / Case Study
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-gray-400">
                  {project.category}
                </span>
              </div>

              <h1
                className={`case-hero-anim font-heading font-black uppercase leading-[0.78] tracking-tighter opacity-0 wrap-break-word ${getCaseStudyHeroTitleClass(project.title)}`}
              >
                {project.title}
              </h1>

              <p className="case-hero-anim mt-8 max-w-2xl text-xl font-light leading-relaxed text-gray-300 opacity-0 md:text-2xl">
                {project.tagline}
              </p>

              <div className="case-hero-anim mt-10 flex flex-col gap-4 opacity-0 sm:flex-row">
                <HoverFill
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/20 bg-white/10 px-7 py-4 backdrop-blur-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
                  contentClassName="gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white group-hocus:text-black"
                >
                  {project.liveDemoLabel}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </HoverFill>

                <HomeSectionHoverFill
                  href={contactSectionHref}
                  className="rounded-full border border-white/10 px-7 py-4 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
                  contentClassName="gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white group-hocus:text-black"
                >
                  Discuss Similar Work
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </HomeSectionHoverFill>
              </div>
            </div>

            <div className="case-hero-frame case-hero-anim relative min-h-[420px] w-full shrink-0 overflow-hidden rounded-4xl border border-white/10 bg-[#0a0a0a] p-5 opacity-0 shadow-[0_30px_120px_rgba(0,0,0,0.45)] md:min-h-[580px] md:rounded-[3rem] md:p-8">
              <div
                className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-[#fde8bf]/10"
                aria-hidden="true"
              />
              <div
                className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#fde8bf]/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="case-hero-media relative h-full min-h-[380px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/70 md:min-h-[520px] md:rounded-4xl">
                <Image
                  src={project.image}
                  alt={`${project.title} interface preview`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-contain p-4 md:p-8"
                />
              </div>
            </div>
          </div>

          <div className="case-reveal mt-12 grid gap-4 border-y border-white/10 py-6 opacity-0 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
                Role
              </p>
              <p className="mt-2 text-sm text-gray-300">{project.role}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
                Timeline
              </p>
              <p className="mt-2 text-sm text-gray-300">{project.timeline}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
                Stack
              </p>
              <p className="mt-2 text-sm text-gray-300">{project.stack}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="case-section-parallax relative isolate overflow-visible pb-16 lg:pb-32">
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
              <div className="case-section-index flex flex-col justify-start lg:self-stretch lg:pt-28">
                <div className="case-section-index-content">
                  <div className="case-reveal opacity-0">
                    <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-[#fde8bf]">
                      Project Context
                    </p>
                    <h2 className="font-heading text-[16vw] font-black uppercase leading-[0.8] tracking-tighter text-white md:text-[6.8vw]">
                      Built To
                      <span className="block text-gray-700">Feel Useful.</span>
                    </h2>
                  </div>
                </div>
              </div>

              <div className="case-section-media space-y-10">
                <p className="case-reveal max-w-3xl text-2xl font-light leading-relaxed text-gray-300 opacity-0 md:text-4xl">
                  {project.overview}
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  {project.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="case-reveal rounded-3xl border border-white/10 bg-white/3 p-6 opacity-0"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gray-600">
                        {metric.label}
                      </p>
                      <p className="mt-4 font-heading text-3xl font-bold uppercase tracking-tight text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-black/35 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="case-section-parallax relative isolate overflow-visible pb-16 lg:pb-32">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
              <div className="case-section-index flex flex-col justify-start lg:self-stretch lg:pt-28">
                <div className="case-section-index-content">
                  <div className="case-reveal opacity-0">
                    <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-[#fde8bf]">
                      Technical System
                    </p>
                    <h2 className="max-w-xl font-heading text-5xl font-black uppercase leading-none tracking-tighter text-white md:text-7xl">
                      Sharp stack. Clear product shape.
                    </h2>
                  </div>
                </div>
              </div>

              <div className="case-section-media space-y-12">
                <div className="case-reveal flex flex-wrap gap-3 opacity-0">
                  {project.techStack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-gray-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="space-y-4">
                  {project.highlights.map((highlight, index) => (
                    <article
                      key={highlight}
                      data-scroll-hover=""
                      className="case-reveal group grid gap-6 border-t border-white/10 py-8 opacity-0 md:grid-cols-[120px_1fr]"
                    >
                      <span className="font-mono text-sm text-gray-600 transition-colors group-hocus:text-[#fde8bf]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-xl font-light leading-relaxed text-gray-300 transition-colors group-hocus:text-white md:text-2xl">
                        {highlight}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="case-reveal mb-14 grid gap-8 border-b border-white/10 pb-8 opacity-0 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.35em] text-[#fde8bf]">
                Visual Archive
              </p>
              <h2 className="font-heading text-[14vw] font-black uppercase leading-[0.82] tracking-tighter text-white md:text-[6vw]">
                Screens
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-end lg:justify-self-end">
              <p className="font-heading text-8xl font-black leading-none tracking-tighter text-white/10 md:text-9xl">
                {String(project.gallery.length).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="case-reveal relative opacity-0">
            <div
              className="pointer-events-none absolute left-8 top-0 hidden h-full w-px bg-linear-to-b from-transparent via-white/15 to-transparent lg:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-20 top-24 hidden h-96 w-96 rounded-full bg-[#fde8bf]/8 blur-3xl lg:block"
              aria-hidden="true"
            />

            <div className="space-y-10 md:space-y-14">
              {project.gallery.map((image, index) => {
                const frameNumber = String(index + 1).padStart(2, "0");

                return (
                  <figure
                    key={`${project.id}-gallery-${index}`}
                    data-scroll-hover=""
                    className="case-image group relative isolate grid gap-5 overflow-visible pb-16 opacity-0 lg:grid-cols-[96px_1fr] lg:items-stretch lg:gap-8 lg:pb-32 lg:pl-16"
                    style={{ zIndex: index + 1 }}
                  >
                    <div className="case-gallery-index hidden lg:flex lg:flex-col lg:justify-end lg:self-stretch">
                      <div className="case-gallery-index-content">
                        <p className="font-heading text-6xl font-black leading-none tracking-tighter text-white/10 transition-colors duration-500 group-hocus:text-[#fde8bf]/25">
                          {frameNumber}
                        </p>
                        <div className="mt-4 h-px w-12 bg-white/10 transition-colors duration-500 group-hocus:bg-[#fde8bf]/40" />
                        <p className="mt-4 [writing-mode:vertical-rl] font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
                          Interface
                        </p>
                      </div>
                    </div>

                    <div className="case-gallery-media relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#080808] p-3 shadow-[0_35px_110px_rgba(0,0,0,0.5)] transition-colors duration-500 group-hocus:border-[#fde8bf]/30 md:p-4">
                      <div
                        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-[#fde8bf]/5 opacity-80"
                        aria-hidden="true"
                      />
                      <div className="relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-black">
                        <div className="flex h-10 items-center justify-between border-b border-white/10 bg-white/[0.035] px-4">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
                          </div>
                          <p className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-gray-600 sm:block">
                            {project.title.replaceAll(" ", "-")} / Frame{" "}
                            {frameNumber}
                          </p>
                        </div>
                        <div className="relative aspect-video bg-black/80">
                          <Image
                            src={image}
                            alt={`${project.title} screenshot ${index + 1}`}
                            fill
                            sizes="(min-width: 1024px) 82vw, 100vw"
                            className="object-contain p-2 transition-transform duration-700 group-hocus:scale-[1.015] md:p-4"
                          />
                        </div>
                      </div>
                      <figcaption className="relative flex items-center justify-between gap-4 px-2 pt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600">
                        <span className="text-[#fde8bf]/80 lg:hidden">
                          Frame {frameNumber}
                        </span>
                        <span>{project.category}</span>
                        <span className="hidden text-gray-500 sm:inline">
                          Desktop Capture
                        </span>
                      </figcaption>
                    </div>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-24 md:px-10 md:pb-32">
        <div className="case-reveal mx-auto overflow-hidden rounded-4xl border border-white/10 bg-white/3 p-8 opacity-0 md:rounded-[3rem] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-[#fde8bf]">
                Next Step
              </p>
              <h2 className="max-w-4xl font-heading text-5xl font-black uppercase leading-none tracking-tighter md:text-8xl">
                Explore the live build.
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <HoverFill
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 bg-white/10 px-7 py-4 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
                contentClassName="gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white group-hocus:text-black"
              >
                {project.liveDemoLabel}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </HoverFill>
              <HomeSectionHoverFill
                href={workSectionHref}
                className="rounded-full border border-white/10 px-7 py-4 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
                contentClassName="gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white group-hocus:text-black"
              >
                More Work
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </HomeSectionHoverFill>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </ProjectCaseStudyShell>
  );
}

import gsap from "gsap";

export interface HeroEntranceTimelineOptions {
  readonly scope: HTMLElement;
  readonly timeline: gsap.core.Timeline;
  readonly position?: gsap.Position;
}

export function appendHeroEntranceTimeline(
  options: HeroEntranceTimelineOptions,
): gsap.core.Timeline {
  const { scope, timeline, position = "-=0.55" } = options;

  timeline
    .fromTo(
      scope.querySelectorAll(".bento-item"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.09,
        clearProps: "opacity,transform",
      },
      position,
    )
    .from(
      scope.querySelector(".hero-img-inner"),
      {
        scale: 1.18,
        duration: 1.4,
      },
      "-=1",
    )
    .from(
      scope.querySelectorAll(".char-reveal"),
      {
        yPercent: 110,
        opacity: 0,
        duration: 0.85,
        stagger: 0.035,
      },
      "-=0.8",
    );

  return timeline;
}

export function revealHeroImmediately(scope: HTMLElement): void {
  gsap.set(scope.querySelectorAll(".bento-item"), {
    opacity: 1,
    y: 0,
  });
  gsap.set(scope.querySelector(".hero-img-inner"), { clearProps: "all" });
  gsap.set(scope.querySelectorAll(".char-reveal"), {
    opacity: 1,
    yPercent: 0,
  });
}

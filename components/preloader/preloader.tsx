"use client";

import { PreloaderBrand } from "@/components/preloader/preloader-brand";
import { PRELOADER_PARTS } from "@/lib/preloader/constants";

export interface PreloaderProps {
  readonly brandName: string;
  readonly roleTitle: string;
  readonly location: string;
  readonly eyebrow?: string;
}

export function Preloader({
  brandName,
  roleTitle,
  location,
  eyebrow = "Portfolio",
}: PreloaderProps): React.ReactElement {
  return (
    <div
      data-preloader={PRELOADER_PARTS.root}
      className="pointer-events-auto fixed inset-0 z-100 overflow-hidden text-white"
      aria-hidden="true"
    >
      <div
        data-preloader={PRELOADER_PARTS.curtainTop}
        className="absolute inset-x-0 top-0 z-20 h-1/2 bg-[#050505]"
      >
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.12]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div
        data-preloader={PRELOADER_PARTS.curtainBottom}
        className="absolute inset-x-0 bottom-0 z-20 h-1/2 bg-[#050505]"
      >
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.12]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div
        data-preloader={PRELOADER_PARTS.content}
        className="relative z-30 flex h-full flex-col items-center justify-center px-6"
      >
        <div
          data-preloader={PRELOADER_PARTS.glow}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 scale-[0.6] rounded-full bg-[#fde8bf]/10 opacity-0 blur-[120px]"
        />

        <div
          data-preloader={PRELOADER_PARTS.ring}
          className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 -rotate-90 scale-[0.85] rounded-full border border-white/10 opacity-0 md:h-72 md:w-72"
        >
          <div
            data-preloader={PRELOADER_PARTS.ringAccent}
            className="absolute -inset-px rounded-full border border-transparent border-t-[#fde8bf]/50 border-r-[#fde8bf]/20"
          />
          <div className="absolute inset-4 rounded-full border border-white/5 md:inset-6" />
        </div>

        <p
          data-preloader={PRELOADER_PARTS.eyebrow}
          className="relative mb-8 translate-y-4 font-mono text-[10px] uppercase tracking-[0.55em] text-[#fde8bf] opacity-0"
        >
          {eyebrow}
        </p>

        <PreloaderBrand brandName={brandName} />

        <div
          data-preloader={PRELOADER_PARTS.progress}
          className="relative mt-14 w-full max-w-sm translate-y-5 opacity-0"
        >
          <div className="mb-4 flex items-end justify-between gap-6">
            <span
              data-preloader={PRELOADER_PARTS.status}
              className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-500"
            >
              Booting environment
            </span>
            <span
              data-preloader={PRELOADER_PARTS.count}
              className="font-heading text-4xl font-black tabular-nums leading-none md:text-5xl"
            >
              0
            </span>
          </div>
          <div className="relative h-px overflow-hidden bg-white/10">
            <div
              data-preloader={PRELOADER_PARTS.bar}
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-linear-to-r from-[#fde8bf] via-[#fde8bf] to-white"
            />
          </div>
        </div>
      </div>

      <div
        data-preloader={PRELOADER_PARTS.corner}
        className="absolute bottom-8 left-8 z-30 max-w-xs translate-y-5 opacity-0"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
          {roleTitle}
        </p>
      </div>

      <div
        data-preloader={PRELOADER_PARTS.corner}
        className="absolute bottom-8 right-8 z-30 translate-y-5 opacity-0"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gray-600">
          {location}
        </p>
      </div>
    </div>
  );
}

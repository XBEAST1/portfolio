import { marqueeItems } from "@/lib/portfolio-data";

/** Enough repeats to cover ultrawide viewports. */
const STRIP_REPEAT_COUNT = 8;

const stripItems: readonly { id: string; label: string }[] = Array.from(
  { length: STRIP_REPEAT_COUNT },
  (_: unknown, repeat: number): readonly { id: string; label: string }[] =>
    marqueeItems.map(
      (label: string, index: number): { id: string; label: string } => ({
        id: `${repeat}-${index}`,
        label,
      }),
    ),
).flat();

export function SectionMarquee(): React.ReactElement {
  return (
    <div
      className="absolute top-0 left-0 w-full overflow-hidden border-b border-white/10 bg-white/5 py-4"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
        <div className="flex shrink-0 items-center gap-8">
          {stripItems.map(
            ({
              id,
              label,
            }: {
              id: string;
              label: string;
            }): React.ReactElement => (
              <span key={id} className="flex shrink-0 items-center gap-8">
                <span>{label}</span>
                <span className="text-[#fde8bf]">•</span>
              </span>
            ),
          )}
        </div>
        <div className="flex shrink-0 items-center gap-8" aria-hidden="true">
          {stripItems.map(
            ({
              id,
              label,
            }: {
              id: string;
              label: string;
            }): React.ReactElement => (
              <span key={id} className="flex shrink-0 items-center gap-8">
                <span>{label}</span>
                <span className="text-[#fde8bf]">•</span>
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

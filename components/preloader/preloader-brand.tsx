import { PRELOADER_PARTS } from "@/lib/preloader/constants";

export interface PreloaderBrandProps {
  readonly brandName: string;
}

const BRAND_HEADING_CLASS =
  "font-heading text-[22vw] font-black uppercase leading-none tracking-tighter md:text-[11vw]";

const LETTER_WRAPPER_CLASS =
  "inline-block overflow-hidden px-[0.03em] align-bottom";

export function PreloaderBrand({
  brandName,
}: PreloaderBrandProps): React.ReactElement {
  const characters: readonly string[] = brandName.split("");

  return (
    <div className="relative inline-block">
      <h2
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 select-none ${BRAND_HEADING_CLASS} text-white/5`}
      >
        {characters.map(
          (character: string, index: number): React.ReactElement => (
            <span
              key={`ghost-${character}-${index}`}
              className={LETTER_WRAPPER_CLASS}
            >
              <span className="inline-block origin-bottom">{character}</span>
            </span>
          ),
        )}
      </h2>
      <h2 className={`relative ${BRAND_HEADING_CLASS} text-white`}>
        {characters.map(
          (character: string, index: number): React.ReactElement => (
            <span
              key={`char-${character}-${index}`}
              className={LETTER_WRAPPER_CLASS}
            >
              <span
                data-preloader={PRELOADER_PARTS.char}
                className="inline-block origin-bottom text-white opacity-0"
              >
                {character}
              </span>
            </span>
          ),
        )}
      </h2>
    </div>
  );
}

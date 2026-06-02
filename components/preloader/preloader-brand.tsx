export interface PreloaderBrandProps {
  readonly brandName: string;
}

export function PreloaderBrand({
  brandName,
}: PreloaderBrandProps): React.ReactElement {
  return (
    <div className="relative inline-block">
      <h2
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none font-heading text-[22vw] font-black uppercase leading-none tracking-tighter text-white/5 md:text-[11vw]"
      >
        {brandName}
      </h2>
      <h2 className="relative font-heading text-[22vw] font-black uppercase leading-none tracking-tighter text-white md:text-[11vw]">
        {brandName.split("").map(
          (character: string, index: number): React.ReactElement => (
            <span
              key={`${character}-${index}`}
              className="inline-block overflow-hidden align-bottom"
            >
              <span
                data-preloader="char"
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

"use client";

import { HoverFill, type HoverFillProps } from "@/components/hover-fill";
import { useHomeSectionLinkClick } from "@/lib/use-home-section-link";

type HomeSectionHoverFillProps = Omit<
  Extract<HoverFillProps, { as: "link" }>,
  "as"
>;

export function HomeSectionHoverFill({
  href,
  onClick,
  ...props
}: HomeSectionHoverFillProps): React.ReactElement {
  const sectionHref = typeof href === "string" ? href : "/";
  const handleSectionClick = useHomeSectionLinkClick(sectionHref);

  return (
    <HoverFill
      {...props}
      as="link"
      href={href}
      onClick={(event): void => {
        handleSectionClick(event);
        onClick?.(event);
      }}
    />
  );
}

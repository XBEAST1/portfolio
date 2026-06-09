"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useHomeSectionLinkClick } from "@/lib/use-home-section-link";

type HomeSectionLinkProps = ComponentProps<typeof Link>;

export function HomeSectionLink({
  href,
  onClick,
  ...props
}: HomeSectionLinkProps): React.ReactElement {
  const sectionHref = typeof href === "string" ? href : "/";
  const handleSectionClick = useHomeSectionLinkClick(sectionHref);

  return (
    <Link
      href={href}
      onClick={(event): void => {
        handleSectionClick(event);
        onClick?.(event);
      }}
      {...props}
    />
  );
}

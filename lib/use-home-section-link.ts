"use client";

import { usePathname } from "next/navigation";
import { type MouseEvent, useCallback } from "react";
import { handleHomeHashLinkClick } from "@/lib/animation";
import { homeHref } from "@/lib/portfolio-data";

export function useHomeSectionLinkClick(
  href: string,
): (event: MouseEvent<HTMLAnchorElement>) => void {
  const pathname = usePathname();

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>): void => {
      handleHomeHashLinkClick(event, href, pathname, homeHref);
    },
    [href, pathname],
  );
}

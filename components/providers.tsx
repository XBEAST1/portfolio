"use client";

import { ReactNode, useEffect } from "react";
import { RouteTransition } from "@/components/route-transition";
import { initScrollSystem } from "@/lib/animation";

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  useEffect((): (() => void) | undefined => initScrollSystem(), []);

  return (
    <>
      <RouteTransition />
      {children}
    </>
  );
}

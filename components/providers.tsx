"use client";

import { ReactNode, useEffect } from "react";
import { RouteTransition } from "@/components/route-transition";
import { initScrollSystem } from "@/lib/animation";
import { initTouchHaptics } from "@/lib/haptics";

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  useEffect((): (() => void) | undefined => {
    const cleanupScroll = initScrollSystem();
    const cleanupHaptics = initTouchHaptics();

    return (): void => {
      cleanupScroll?.();
      cleanupHaptics?.();
    };
  }, []);

  return (
    <>
      <RouteTransition />
      {children}
    </>
  );
}

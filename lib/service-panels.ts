"use client";

import { scheduleScrollLayoutRefresh } from "@/lib/animation";
import { mediaQueryMd } from "@/lib/breakpoints";
import { setServicePanelsState } from "@/lib/service-panels-state";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export const SERVICE_PANEL_EASE_CLASS =
  "ease-[cubic-bezier(0.76,0,0.24,1)] duration-700";

const PANEL_TRANSITION_PROPERTIES: ReadonlySet<string> = new Set([
  "max-height",
  "opacity",
]);

function isPanelTransitionTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    target.classList.contains("service-panel")
  );
}

function isPanelTransitionProperty(propertyName: string): boolean {
  return PANEL_TRANSITION_PROPERTIES.has(propertyName);
}

function supportsHoverInteraction(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia(mediaQueryMd).matches &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function usePanelTransitionBus(
  listRef: RefObject<HTMLDivElement | null>,
  getVisibleIndex: () => number,
): void {
  const getVisibleIndexRef = useRef(getVisibleIndex);

  useEffect((): void => {
    getVisibleIndexRef.current = getVisibleIndex;
  });

  useEffect((): void => {
    setServicePanelsState("idle");
  }, []);

  useEffect((): (() => void) | undefined => {
    const list: HTMLDivElement | null = listRef.current;
    if (!list) {
      return undefined;
    }

    let activeTransitions = 0;

    const finishTransition = (): void => {
      setServicePanelsState(
        getVisibleIndexRef.current() >= 0 ? "open" : "idle",
      );
      scheduleScrollLayoutRefresh();
    };

    const onTransitionStart = (event: TransitionEvent): void => {
      if (!isPanelTransitionTarget(event.target)) {
        return;
      }

      if (!isPanelTransitionProperty(event.propertyName)) {
        return;
      }

      activeTransitions += 1;
      setServicePanelsState("animating");
    };

    const onTransitionEnd = (event: TransitionEvent): void => {
      if (!isPanelTransitionTarget(event.target)) {
        return;
      }

      if (!isPanelTransitionProperty(event.propertyName)) {
        return;
      }

      activeTransitions = Math.max(0, activeTransitions - 1);

      if (activeTransitions > 0) {
        return;
      }

      finishTransition();
    };

    list.addEventListener("transitionstart", onTransitionStart, true);
    list.addEventListener("transitionend", onTransitionEnd, true);

    return (): void => {
      list.removeEventListener("transitionstart", onTransitionStart, true);
      list.removeEventListener("transitionend", onTransitionEnd, true);
      setServicePanelsState("idle");
      scheduleScrollLayoutRefresh();
    };
  }, [listRef]);
}

export type UseServicePanelsResult = {
  listRef: RefObject<HTMLDivElement | null>;
  visibleIndex: number;
  onRowEnter: (index: number) => void;
  onListLeave: () => void;
  toggleService: (index: number) => void;
};

function clearServiceRowPressState(row: HTMLElement | null): void {
  row?.querySelector<HTMLButtonElement>("button")?.blur();
}

/** Tap on touch, hover-preview on desktop — open visuals driven by React state. */
export function useServicePanels(): UseServicePanelsResult {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const visibleIndex: number =
    supportsHoverInteraction() && hoveredIndex !== null
      ? hoveredIndex
      : selectedIndex;

  const getVisibleIndex = useCallback((): number => visibleIndex, [visibleIndex]);

  usePanelTransitionBus(listRef, getVisibleIndex);

  const onRowEnter = useCallback((index: number): void => {
    if (!supportsHoverInteraction()) {
      return;
    }

    setHoveredIndex(index);
  }, []);

  const onListLeave = useCallback((): void => {
    setHoveredIndex(null);
  }, []);

  const toggleService = useCallback((index: number): void => {
    setSelectedIndex((currentIndex: number): number => {
      const isClosing = currentIndex === index;

      if (isClosing) {
        const row = listRef.current?.querySelectorAll<HTMLElement>(
          ".service-row",
        )[index];
        clearServiceRowPressState(row ?? null);
        return -1;
      }

      return index;
    });
    setHoveredIndex(null);
  }, []);

  return {
    listRef,
    visibleIndex,
    onRowEnter,
    onListLeave,
    toggleService,
  };
}

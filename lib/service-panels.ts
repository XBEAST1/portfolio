"use client";

import { scheduleScrollLayoutRefresh } from "@/lib/animation";
import { setServicePanelsState } from "@/lib/service-panels-state";
import { useCallback, useEffect, useRef, type RefObject } from "react";

export const SERVICE_PANEL_SELECTOR = ".service-panel";
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

/** Imperative open/close — avoids React re-renders on hover. */
export function syncServicePanelRows(
  rows: readonly (HTMLDivElement | null)[],
  visibleIndex: number,
): void {
  rows.forEach((row: HTMLDivElement | null, index: number): void => {
    if (!row) {
      return;
    }

    const panel: HTMLElement | null = row.querySelector(SERVICE_PANEL_SELECTOR);
    const button: HTMLButtonElement | null = row.querySelector("button");
    const arrow: SVGElement | null = row.querySelector("[data-service-arrow]");

    if (!panel || !button) {
      return;
    }

    const isOpen: boolean = index === visibleIndex;

    panel.classList.toggle("max-h-96", isOpen);
    panel.classList.toggle("opacity-100", isOpen);
    panel.classList.toggle("max-h-0", !isOpen);
    panel.classList.toggle("opacity-0", !isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
    arrow?.classList.toggle("rotate-45", isOpen);
  });
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
  setRowRef: (index: number, element: HTMLDivElement | null) => void;
  onRowEnter: (index: number) => void;
  onListLeave: () => void;
  toggleService: (index: number) => void;
};

/** Hover + click panel state without re-rendering Services on every mouseenter. */
export function useServicePanels(): UseServicePanelsResult {
  const listRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const selectedIndexRef = useRef<number>(-1);
  const hoveredIndexRef = useRef<number | null>(null);

  const getVisibleIndex = useCallback((): number => {
    return hoveredIndexRef.current ?? selectedIndexRef.current;
  }, []);

  const syncRows = useCallback((): void => {
    syncServicePanelRows(rowRefs.current, getVisibleIndex());
  }, [getVisibleIndex]);

  usePanelTransitionBus(listRef, getVisibleIndex);

  const onRowEnter = useCallback(
    (index: number): void => {
      hoveredIndexRef.current = index;
      syncRows();
    },
    [syncRows],
  );

  const onListLeave = useCallback((): void => {
    hoveredIndexRef.current = null;
    syncRows();
  }, [syncRows]);

  const toggleService = useCallback(
    (index: number): void => {
      selectedIndexRef.current =
        selectedIndexRef.current === index ? -1 : index;
      syncRows();
    },
    [syncRows],
  );

  const setRowRef = useCallback(
    (index: number, element: HTMLDivElement | null): void => {
      rowRefs.current[index] = element;
    },
    [],
  );

  return {
    listRef,
    setRowRef,
    onRowEnter,
    onListLeave,
    toggleService,
  };
}

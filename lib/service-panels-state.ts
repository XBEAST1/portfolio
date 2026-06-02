export type ServicePanelsState = "idle" | "animating" | "open";

const ATTRIBUTE = "data-services-panels";

export function setServicePanelsState(state: ServicePanelsState): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute(ATTRIBUTE, state);
}

export function isServicePanelsAnimating(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.getAttribute(ATTRIBUTE) === "animating";
}

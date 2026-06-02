let spaNavigationOccurred = false;

export function markSpaNavigationOccurred(): void {
  spaNavigationOccurred = true;
}

export function shouldPlayInitialPreloader(): boolean {
  return !spaNavigationOccurred;
}

type ScrollHoverSync = () => void;

const scrollHoverSyncs = new Set<ScrollHoverSync>();

export function registerScrollHoverSync(sync: ScrollHoverSync): () => void {
  scrollHoverSyncs.add(sync);

  return (): void => {
    scrollHoverSyncs.delete(sync);
  };
}

export function runScrollHoverSyncs(): void {
  scrollHoverSyncs.forEach((sync: ScrollHoverSync): void => {
    sync();
  });
}

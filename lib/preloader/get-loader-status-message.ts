import { PRELOADER_STATUS_MESSAGES } from "@/lib/preloader/constants";

export function getLoaderStatusMessage(progress: number): string {
  if (progress < 30) {
    return PRELOADER_STATUS_MESSAGES[0];
  }

  if (progress < 60) {
    return PRELOADER_STATUS_MESSAGES[1];
  }

  if (progress < 90) {
    return PRELOADER_STATUS_MESSAGES[2];
  }

  return PRELOADER_STATUS_MESSAGES[3];
}

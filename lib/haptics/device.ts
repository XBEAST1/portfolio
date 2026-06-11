/** Full UA still exposes model names; reduced Chrome UA uses the placeholder `K`. */
const LRA_UA_RE =
  /(?:;\s*pixel\b|pixel \d|nothing phone|sm-[sfn]\d{3}|oneplus (?:1[0-9]|[89](?:\s|pro|$)))/i;

const LRA_MODEL_RE =
  /(?:pixel|nothing phone|oneplus|(?:^|\s)(?:sm-[sfn]|le21|le22|cph24|cph25|xq-[ctde]))/i;

const REDUCED_ANDROID_UA_RE = /Android 10; K\b/;

export interface LraDeviceInput {
  readonly ua?: string;
  readonly model?: string;
}

/** Returns true when UA or Client Hints model matches a known flagship/LRA-capable device. */
export function isLraCapableDevice(input: LraDeviceInput): boolean {
  const ua = input.ua?.trim() ?? "";
  const model = input.model?.trim() ?? "";

  if (ua.length > 0 && LRA_UA_RE.test(ua)) {
    return true;
  }

  if (model.length > 0 && LRA_MODEL_RE.test(model)) {
    return true;
  }

  return false;
}

/** Chrome's privacy-reduced Android UA reports a fixed model placeholder. */
export function isReducedAndroidUa(ua: string): boolean {
  return REDUCED_ANDROID_UA_RE.test(ua);
}

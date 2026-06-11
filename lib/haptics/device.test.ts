import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isLraCapableDevice,
  isReducedAndroidUa,
} from "./device.ts";

const REDUCED_PIXEL_UA =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

describe("isLraCapableDevice", () => {
  it("detects pixel from client hints model", () => {
    assert.equal(
      isLraCapableDevice({ model: "Pixel 7 Pro" }),
      true,
    );
  });

  it("detects pixel from full user agent", () => {
    assert.equal(
      isLraCapableDevice({
        ua: "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36",
      }),
      true,
    );
  });

  it("detects samsung flagship from model code", () => {
    assert.equal(isLraCapableDevice({ model: "SM-S928B" }), true);
  });

  it("detects oneplus from user agent", () => {
    assert.equal(
      isLraCapableDevice({
        ua: "Mozilla/5.0 (Linux; Android 14; OnePlus 12) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36",
      }),
      true,
    );
  });

  it("detects oneplus from model string", () => {
    assert.equal(isLraCapableDevice({ model: "OnePlus CPH2449" }), true);
  });

  it("returns false for samsung a-series", () => {
    assert.equal(isLraCapableDevice({ model: "SM-A536B" }), false);
  });

  it("returns false for unknown devices", () => {
    assert.equal(isLraCapableDevice({ model: "Redmi Note 12" }), false);
  });

  it("returns false for reduced ua without model hint", () => {
    assert.equal(isLraCapableDevice({ ua: REDUCED_PIXEL_UA }), false);
  });

  it("returns true when reduced ua is paired with pixel model", () => {
    assert.equal(
      isLraCapableDevice({ ua: REDUCED_PIXEL_UA, model: "Pixel 7 Pro" }),
      true,
    );
  });
});

describe("isReducedAndroidUa", () => {
  it("detects chrome reduced android placeholder", () => {
    assert.equal(isReducedAndroidUa(REDUCED_PIXEL_UA), true);
  });

  it("returns false for full pixel user agent", () => {
    assert.equal(
      isReducedAndroidUa(
        "Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36",
      ),
      false,
    );
  });
});

import { describe, expect, it } from "vitest";
import { sceneSkipReason, type SceneEnv } from "../src/components/scene/store";

const desktop: SceneEnv = { width: 1440, deviceMemory: 8, reducedMotion: false };

describe("quando carregar a cena 3D", () => {
  it("carrega em desktop", () => {
    expect(sceneSkipReason(desktop)).toBeNull();
  });

  it("carrega quando o browser não expõe deviceMemory nem connection (Safari, Firefox)", () => {
    expect(sceneSkipReason({ width: 1440, reducedMotion: false })).toBeNull();
  });

  it.each<[string, Partial<SceneEnv>]>([
    ["largura < 768px", { width: 767 }],
    ["saveData", { saveData: true }],
    ["ligação 2G", { effectiveType: "2g" }],
    ["deviceMemory <= 4", { deviceMemory: 4 }],
    ["prefers-reduced-motion", { reducedMotion: true }],
  ])("não carrega com %s", (_label, over) => {
    expect(sceneSkipReason({ ...desktop, ...over })).not.toBeNull();
  });

  it("768px já conta como desktop", () => {
    expect(sceneSkipReason({ ...desktop, width: 768 })).toBeNull();
  });
});

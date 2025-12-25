import { invoke } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";

export async function getAppDataDir() {
  return await appDataDir();
}

type RustSettings = {
  color_theme: "Light" | "Dark" | "System";
};

export async function getSettings(): Promise<Settings> {
  return await invoke<RustSettings>("get_settings").then((settings) => ({
    colorTheme: settings.color_theme,
  }));
}

export async function saveSettings(settings: Settings): Promise<Settings> {
  return await invoke<RustSettings>("save_settings", {
    settings: { color_theme: settings.colorTheme },
  }).then((settings) => ({
    colorTheme: settings.color_theme,
  }));
}

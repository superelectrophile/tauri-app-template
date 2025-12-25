import { createContext } from "react";

export type SettingsContextType = {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
};
export const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  setSettings: () => {},
});

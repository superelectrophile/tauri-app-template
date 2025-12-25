import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import HomeIcon from "../assets/home.svg?react";
import { Icon } from "../components/Icon";
import SettingsIcon from "../assets/settings.svg?react";
import { SettingsContext } from "../SettingsContext";
import { useState, useEffect, useCallback } from "react";
import { getSettings, saveSettings } from "../api";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const _setSettings = useCallback(async (settings: Settings) => {
    setSettings(await saveSettings(settings));
  }, []);

  useEffect(() => {
    (async () => {
      setSettings(await getSettings());
    })();
  }, []);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (settings?.colorTheme === "Light") {
      root.classList.add("light");
    } else if (settings?.colorTheme === "Dark") {
      root.classList.add("dark");
    }
    // "System" or null: no class, CSS media query handles it
  }, [settings?.colorTheme]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings: _setSettings }}>
      <main className="flex h-full w-full flex-col">
        <nav className="flex flex-row items-center gap-4 p-4 bg-bg-light">
          <h1 className="text-2xl font-bold">{__APP_NAME__}</h1>
          <div className="flex-1" />
          <Link to="/home">
            {({ isActive }) => <Icon icon={HomeIcon} active={isActive} />}
          </Link>
          <Link to="/settings">
            {({ isActive }) => <Icon icon={SettingsIcon} active={isActive} />}
          </Link>
        </nav>
        <Outlet />
      </main>
    </SettingsContext.Provider>
  );
}

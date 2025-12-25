import { createFileRoute } from "@tanstack/react-router";
import { getAppDataDir } from "../api";
import { useState, useEffect, useContext } from "react";
import { Button } from "../components/Button";
import { SettingsContext } from "../SettingsContext";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { settings, setSettings } = useContext(SettingsContext);
  const [appDataDirectory, setAppDataDirectory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setAppDataDirectory(await getAppDataDir());
    })();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <p className="text-sm color-hint text-right p-2">Color Theme</p>
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => setSettings({ ...settings, colorTheme: "Light" })}
            selected={settings?.colorTheme === "Light"}
          >
            Light
          </Button>
          <Button
            onClick={() => setSettings({ ...settings, colorTheme: "Dark" })}
            selected={settings?.colorTheme === "Dark"}
          >
            Dark
          </Button>
          <Button
            onClick={() => setSettings({ ...settings, colorTheme: "System" })}
            selected={settings?.colorTheme === "System"}
          >
            System
          </Button>
        </div>
      </div>
      <h1 className="text-xl font-bold">Dev</h1>
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <p className="text-sm color-hint text-right p-2">Version</p>
        <code className="text-text bg-bg-light p-1 rounded-md">
          {__APP_VERSION__}
        </code>
        <p className="text-sm color-hint text-right p-2">App Data Directory</p>
        <code className="text-text bg-bg-light p-1 rounded-md">
          {appDataDirectory}
        </code>
      </div>
    </div>
  );
}

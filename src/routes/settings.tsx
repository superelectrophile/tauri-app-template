import { createFileRoute } from "@tanstack/react-router";
import { appDataDir } from "@tauri-apps/api/path";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [appDataDirectory, setAppDataDirectory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setAppDataDirectory(await appDataDir());
    })();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Settings</h1>
      <h1 className="text-xl font-bold">Dev</h1>
      <div className="grid grid-cols-[auto_1fr] gap-4">
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

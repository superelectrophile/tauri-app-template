import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import HomeIcon from "../assets/home.svg?react";
import { Icon } from "../components/Icon";
import SettingsIcon from "../assets/settings.svg?react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
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
  );
}

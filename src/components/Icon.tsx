import { FunctionComponent, SVGProps } from "react";
import clsx from "clsx";

export interface IconProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  className?: string;
  active?: boolean;
}

export function Icon({ icon: IconComponent, className, active }: IconProps) {
  return (
    <IconComponent
      className={clsx(
        "w-8 h-8 p-1 transition-colors duration-(--duration-default-transition)  rounded-md hover:text-text hover:bg-hint bg-transparent",
        active ? "text-text" : "text-hint",
        className
      )}
    />
  );
}

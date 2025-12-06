import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className={clsx(
        "cursor-pointer p-2 rounded-md border border-hint text-sm transition-colors duration-(--duration-default-transition) hover:bg-hint shadow-md",
        props.className,
        props.selected ? "bg-hint" : "bg-transparent"
      )}
      {...props}
    >
      {props.children}
    </button>
  );
}

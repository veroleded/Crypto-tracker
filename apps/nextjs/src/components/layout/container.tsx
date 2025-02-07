import { cn } from "@acme/ui/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "small" | "large";
}

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-5xl": size === "small",
          "max-w-7xl": size === "default",
          "max-w-[1920px]": size === "large",
        },
        "transition-all duration-300 ease-in-out",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
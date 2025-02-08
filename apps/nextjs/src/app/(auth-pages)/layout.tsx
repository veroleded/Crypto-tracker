import { cn } from "@acme/ui/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-[100dvh] bg-gradient-to-b from-background to-muted/50",
        "flex flex-col",
        "duration-1000 animate-in fade-in",
      )}
    >
      <div className={cn("flex-1", "flex items-center justify-center")}>
        <div
          className={cn(
            "w-[400px] max-w-[90vw]",
            "min-h-[100dvh] sm:min-h-0",
            "flex items-center",
            "duration-1000 animate-in fade-in slide-in-from-bottom-4",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

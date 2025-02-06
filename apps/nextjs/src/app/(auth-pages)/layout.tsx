export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50/90 dark:bg-zinc-950/90">
      {children}
    </div>
  );
}

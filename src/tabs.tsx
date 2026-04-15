export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-3xl border-4 border-black ${className}`}>{children}</div>;
}

export function Button({
  children,
  className = "",
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "default" }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl border-2 border-black px-4 py-3 text-sm font-medium transition-colors";
  const style =
    variant === "outline"
      ? "bg-white text-black hover:bg-[#f3f3f3]"
      : "bg-black text-white hover:opacity-90";

  return (
    <button {...props} className={`${base} ${style} ${className}`}>
      {children}
    </button>
  );
}

export function PixelCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`shadow-[12px_12px_0_0_rgba(0,0,0,1)] ${className}`}>
      {children}
    </Card>
  );
}

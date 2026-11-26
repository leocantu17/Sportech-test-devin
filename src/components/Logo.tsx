export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-black tracking-tight ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-sm text-white">S</span>
      <span>
        SPORT<span className="text-brand">ECH</span>
      </span>
    </span>
  );
}

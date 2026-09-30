interface ProgressBarProps {
  /** Current progress value (0–100) */
  value: number;
  /** Optional label displayed above the bar */
  label?: string;
  /** Show percentage text */
  showPercent?: boolean;
  /** Visual size of the bar */
  size?: "sm" | "md";
  /** Semantic color theme */
  variant?: "primary" | "success" | "accent";
}

export function ProgressBar({
  value,
  label,
  showPercent = false,
  size = "md",
  variant = "primary",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const barHeight = size === "sm" ? "h-1.5" : "h-2";

  const colorClasses = {
    primary: "bg-primary-600",
    success: "bg-success-600",
    accent: "bg-accent-600",
  }[variant];

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          {label && (
            <span className="font-medium text-slate-700">{label}</span>
          )}
          {showPercent && (
            <span className="tabular-nums font-semibold text-slate-600">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${barHeight} bg-slate-100 border border-slate-200/60 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className={`${barHeight} ${colorClasses} rounded-full transition-all duration-200 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

interface ProgressBarProps {
  /** Current progress value (0–100) */
  value: number;
  /** Optional label displayed above the bar */
  label?: string;
  /** Show percentage text */
  showPercent?: boolean;
  /** Visual size of the bar */
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  label,
  showPercent = false,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const barHeight = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercent && (
            <span className="text-sm tabular-nums text-gray-500">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${barHeight} bg-gray-200 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className={`${barHeight} bg-primary-500 rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

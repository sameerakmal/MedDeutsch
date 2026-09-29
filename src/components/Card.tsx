import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Remove default padding when the card content handles its own layout */
  noPadding?: boolean;
}

export function Card({
  children,
  noPadding = false,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={`bg-surface-card rounded-xl border border-gray-200 shadow-sm ${
        noPadding ? "" : "p-5 sm:p-6"
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

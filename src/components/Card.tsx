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
      className={`bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${
        noPadding ? "" : "p-5 sm:p-6"
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

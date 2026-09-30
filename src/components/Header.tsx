import { Link } from "react-router-dom";
import { Stethoscope, Menu, X } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  mobileNavOpen?: boolean;
}

export function Header({ onMenuClick, mobileNavOpen }: HeaderProps) {
  return (
    <header className="h-14 sm:h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileNavOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        )}

        <Link
          to="/"
          className="flex items-center gap-2.5 text-primary-800 hover:text-primary-900 transition-colors focus-visible:ring-2 focus-visible:ring-primary-700 rounded-sm"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200/80 flex items-center justify-center text-primary-700 shrink-0">
            <Stethoscope className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                MedDeutsch
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                A1/A2 Nursing
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium hidden sm:flex">
        <span>Medical German for Indian Nurses</span>
      </div>
    </header>
  );
}

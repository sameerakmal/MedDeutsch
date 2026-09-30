import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  BarChart3,
  RotateCcw,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { Header } from "../components";

interface NavEntry {
  label: string;
  path: string;
  icon: ReactNode;
}

const navigation: NavEntry[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Learn", path: "/learn", icon: <BookOpen className="w-4 h-4" /> },
  { label: "Practice", path: "/practice", icon: <PenLine className="w-4 h-4" /> },
  { label: "Review", path: "/review", icon: <RotateCcw className="w-4 h-4" /> },
  { label: "Results", path: "/results", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Progress", path: "/progress", icon: <TrendingUp className="w-4 h-4" /> },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile navigation when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  return (
    <div className="flex flex-col h-screen bg-surface">
      <Header
        onMenuClick={() => setMobileNavOpen((prev) => !prev)}
        mobileNavOpen={mobileNavOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex flex-col w-60 border-r border-slate-200 bg-white py-5 shrink-0"
        >
          <div className="px-4 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
          </div>
          <NavList onClick={() => {}} />
        </nav>

        {/* Mobile drawer overlay */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/30 transition-opacity"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="relative flex flex-col w-72 max-w-[85vw] bg-white h-full shadow-lg border-r border-slate-200 p-5 z-10"
            >
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NavList onClick={() => setMobileNavOpen(false)} />
            </nav>
          </div>
        )}

        {/* Main content container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavList({ onClick }: { onClick: () => void }) {
  return (
    <ul className="flex flex-col gap-1 px-3">
      {navigation.map((item) => (
        <li key={item.path}>
          <NavLink
            to={item.path}
            onClick={onClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary-50 text-primary-800 font-semibold border border-primary-200/70"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

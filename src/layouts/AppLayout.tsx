import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PenLine,
  BarChart3,
  RotateCcw,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Header } from "../components";

interface NavEntry {
  label: string;
  path: string;
  icon: ReactNode;
}

const navigation: NavEntry[] = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Learn", path: "/learn", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Practice", path: "/practice", icon: <PenLine className="w-5 h-5" /> },
  { label: "Review", path: "/review", icon: <RotateCcw className="w-5 h-5" /> },
  { label: "Results", path: "/results", icon: <BarChart3 className="w-5 h-5" /> },
  { label: "Progress", path: "/progress", icon: <TrendingUp className="w-5 h-5" /> },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex flex-col w-56 border-r border-gray-200 bg-white py-4 shrink-0"
        >
          <NavList onClick={() => {}} />
        </nav>

        {/* Mobile nav toggle */}
        <button
          type="button"
          aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile overlay */}
        {mobileNavOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <nav
              aria-label="Main navigation"
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl py-4 pt-20"
            >
              <NavList onClick={() => setMobileNavOpen(false)} />
            </nav>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
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
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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

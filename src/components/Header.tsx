import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center px-4 sm:px-6 shrink-0">
      <Link
        to="/"
        className="flex items-center gap-2.5 text-primary-700 hover:text-primary-800 transition-colors"
      >
        <Stethoscope className="w-6 h-6" aria-hidden="true" />
        <span className="text-lg font-bold tracking-tight">MedDeutsch</span>
      </Link>
    </header>
  );
}

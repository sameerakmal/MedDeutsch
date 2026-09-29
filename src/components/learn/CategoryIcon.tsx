import {
  Heart,
  Thermometer,
  MessageCircle,
  Building2,
  Stethoscope,
  Activity,
  Layers,
  BookOpen,
} from "lucide-react";

interface CategoryIconProps {
  name: string;
  className?: string;
}

/**
 * Renders the appropriate Lucide icon corresponding to category metadata.
 */
export function CategoryIcon({
  name,
  className = "w-5 h-5",
}: CategoryIconProps) {
  switch (name) {
    case "Heart":
      return <Heart className={className} aria-hidden="true" />;
    case "Thermometer":
      return <Thermometer className={className} aria-hidden="true" />;
    case "MessageCircle":
      return <MessageCircle className={className} aria-hidden="true" />;
    case "Building2":
      return <Building2 className={className} aria-hidden="true" />;
    case "Stethoscope":
      return <Stethoscope className={className} aria-hidden="true" />;
    case "Activity":
      return <Activity className={className} aria-hidden="true" />;
    case "Layers":
      return <Layers className={className} aria-hidden="true" />;
    default:
      return <BookOpen className={className} aria-hidden="true" />;
  }
}

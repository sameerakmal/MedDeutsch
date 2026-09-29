import { Card } from "../components";
import { BookOpen, PenLine, RotateCcw, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickLinkProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function QuickLink({ to, icon, title, description }: QuickLinkProps) {
  return (
    <Link to={to} className="block group">
      <Card className="transition-shadow hover:shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Choose where to continue.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <QuickLink
          to="/learn"
          icon={<BookOpen className="w-5 h-5 text-primary-600" />}
          title="Learn"
          description="Study new medical vocabulary and phrases."
        />
        <QuickLink
          to="/practice"
          icon={<PenLine className="w-5 h-5 text-primary-600" />}
          title="Practice"
          description="Test your knowledge with interactive quizzes."
        />
        <QuickLink
          to="/review"
          icon={<RotateCcw className="w-5 h-5 text-primary-600" />}
          title="Review"
          description="Revisit words you found difficult."
        />
        <QuickLink
          to="/progress"
          icon={<TrendingUp className="w-5 h-5 text-primary-600" />}
          title="Progress"
          description="Track your learning journey over time."
        />
      </div>
    </div>
  );
}

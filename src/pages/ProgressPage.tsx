import { Card, ProgressBar } from "../components";
import { TrendingUp } from "lucide-react";

export function ProgressPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-500 mt-1">
          Track how your vocabulary knowledge grows over time.
        </p>
      </div>

      <Card>
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-primary-600" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Start learning to see progress
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Your overall vocabulary mastery will be tracked here as you complete
            lessons and practice sessions.
          </p>

          {/* Example of the ProgressBar component */}
          <div className="w-full max-w-xs">
            <ProgressBar value={0} label="Overall mastery" showPercent />
          </div>
        </div>
      </Card>
    </div>
  );
}

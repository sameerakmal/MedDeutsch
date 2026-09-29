import { Card } from "../components";
import { PenLine } from "lucide-react";

export function PracticePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Practice</h1>
        <p className="text-gray-500 mt-1">
          Test and strengthen your medical German vocabulary.
        </p>
      </div>

      <Card>
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
            <PenLine className="w-6 h-6 text-primary-600" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Practice quizzes coming soon
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Interactive quizzes with feedback and mistake tracking will appear
            here.
          </p>
        </div>
      </Card>
    </div>
  );
}

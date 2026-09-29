import { Card } from "../components";
import { RotateCcw } from "lucide-react";

export function ReviewPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review</h1>
        <p className="text-gray-500 mt-1">
          Revisit vocabulary you need to practise more.
        </p>
      </div>

      <Card>
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
            <RotateCcw className="w-6 h-6 text-primary-600" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Nothing to review yet
          </h2>
          <p className="text-sm text-gray-500 max-w-sm">
            Words you get wrong during practice will be collected here for
            focused review.
          </p>
        </div>
      </Card>
    </div>
  );
}

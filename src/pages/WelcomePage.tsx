import { Link } from "react-router-dom";
import { Button } from "../components";
import { Stethoscope, ArrowRight } from "lucide-react";

export function WelcomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center max-w-lg px-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
          <Stethoscope className="w-8 h-8 text-primary-600" aria-hidden="true" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          MedDeutsch
        </h1>
        <p className="text-lg text-gray-500 mb-2">
          Medical German Practice for Nurses
        </p>
        <p className="text-gray-500 mb-8">
          Learn and practise A1–A2 medical German vocabulary through interactive
          lessons and quizzes designed for Indian nursing professionals.
        </p>

        <Link to="/dashboard">
          <Button size="lg">
            Get Started
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

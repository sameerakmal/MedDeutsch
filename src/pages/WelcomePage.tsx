import { Link } from "react-router-dom";
import { Button, Card } from "../components";
import { Stethoscope, ArrowRight, BookOpen, Volume2, RotateCcw, CheckCircle2 } from "lucide-react";

export function WelcomePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top minimal header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-primary-800">
          <Stethoscope className="w-5 h-5 text-primary-700" aria-hidden="true" />
          <span className="font-bold text-slate-900 tracking-tight text-base">MedDeutsch</span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          A1/A2 Nursing
        </span>
      </div>

      {/* Main clinical card */}
      <div className="max-w-xl mx-auto w-full my-auto py-6">
        <Card className="p-6 sm:p-8 space-y-6 border-slate-200">
          {/* Emblem & Title */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/80 text-primary-700 flex items-center justify-center mx-auto">
              <Stethoscope className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                MedDeutsch
              </h1>
              <p className="text-sm font-semibold text-primary-700 mt-0.5">
                Medical German for Nursing Professionals
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Focused medical German training for Indian nurses. Master essential A1–A2 vocabulary, grammatical gender (der/die/das), and clinical routine phrasing.
            </p>
          </div>

          {/* 3 Core Educational Pillars */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-primary-700 shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Clinical Nursing Vocabulary
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Anatomy, symptoms, hospital units, vital signs, and patient communication.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-primary-700 shrink-0 mt-0.5">
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Articles & Audio Pronunciation
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Learn nouns with proper gender (der/die/das) and native audio pronunciation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-primary-700 shrink-0 mt-0.5">
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Active Recall & Review
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Automatic mistake tracking and targeted spaced review until terms are mastered.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <Link to="/dashboard" className="block">
              <Button size="lg" className="w-full font-semibold shadow-xs">
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        <span>Designed for Indian nurses preparing for German hospitals and care facilities</span>
      </footer>
    </div>
  );
}

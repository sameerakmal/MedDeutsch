import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import {
  WelcomePage,
  DashboardPage,
  LearnPage,
  PracticePage,
  ResultsPage,
  ReviewPage,
  ProgressPage,
} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Welcome page — no sidebar layout */}
        <Route path="/" element={<WelcomePage />} />

        {/* Main app routes — wrapped in AppLayout with sidebar */}
        <Route
          path="/*"
          element={
            <AppLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="learn" element={<LearnPage />} />
                <Route path="practice" element={<PracticePage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="progress" element={<ProgressPage />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

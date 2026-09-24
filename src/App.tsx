import { useState } from "react";
import Header from "./components/Header";
import StudyForm from "./components/StudyForm";
import StudyPlan from "./components/StudyPlan";

interface StudyPlanData {
  summary: string;
  days: {
    day: number;
    tasks: string[];
  }[];
}

function App() {
  const [plan, setPlan] = useState<StudyPlanData | null>(null);
  const [view, setView] = useState<"form" | "plan">("form");

  const handlePlanGenerated = (generatedPlan: StudyPlanData) => {
    setPlan(generatedPlan);
    setView("plan");
  };

  const handleBackToForm = () => {
    setView("form");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#343044]">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {view === "form" && (
          <>
            <section className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Plan your study. Make it realistic.
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Tell us what you're studying, how much time you have, and where
                you are right now.
              </p>
            </section>

            <StudyForm onPlanGenerated={handlePlanGenerated} />
          </>
        )}

        {view === "plan" && plan && (
          <StudyPlan plan={plan} onBack={handleBackToForm} />
        )}
      </main>
    </div>
  );
}

export default App;

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
    <div className="min-h-screen bg-[#F3F1EC] bg-[repeating-linear-gradient(to_bottom,transparent,transparent_27px,#E4DFD359_28px)] text-[#2B2A28]">
      <div className="lg:hidden">
        <Header />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:flex lg:min-h-screen lg:max-w-5xl lg:flex-col lg:justify-center">
        {view === "form" && (
          <div className="lg:grid lg:grid-cols-[45%_55%] lg:items-center lg:gap-10">
            <div>
              <section className="mb-2">
                <h2 className="font-serif text-xl font-bold tracking-tight text-[#2B2A28]">
                  Plan your study. Make it realistic.
                </h2>

                <p className="mt-0.5 text-sm text-[#6B6862]">
                  Tell us what you're studying, how much time you have, and
                  where you are right now.
                </p>
              </section>

              <StudyForm onPlanGenerated={handlePlanGenerated} />
            </div>

            <aside className="mt-6 hidden lg:mt-0 lg:block lg:pl-4">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2B2A28]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="#F3F1EC"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-serif text-lg font-semibold tracking-tight text-[#2B2A28]">
                  StudyFlow
                </span>
              </div>

              <p className="font-serif text-2xl font-bold leading-snug text-[#2B2A28] lg:text-3xl">
                "Turn what you need to study into a plan you'll actually
                follow."
              </p>
              <div className="mt-4 inline-block rounded border border-[#E4DFD3] bg-white px-3 py-2 text-xs text-[#6B6862] shadow-sm">
                💡 Add chapters one at a time — press Enter or click Add.
              </div>
            </aside>
          </div>
        )}

        {view === "plan" && plan && (
          <div className="lg:grid lg:grid-cols-[55%_45%] lg:items-center lg:gap-10">
            <aside className="mb-6 hidden lg:mb-0 lg:block lg:pr-4">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2B2A28]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="#F3F1EC"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-serif text-lg font-semibold tracking-tight text-[#2B2A28]">
                  StudyFlow
                </span>
              </div>

              <p className="font-serif text-2xl font-bold leading-snug text-[#2B2A28] lg:text-3xl">
                "The best plan is the one you actually stick to — one day at a
                time."
              </p>
              <div className="mt-4 inline-block rounded border border-[#E4DFD3] bg-white px-3 py-2 text-xs text-[#6B6862] shadow-sm">
                ✅ Check off each task as you finish it to track progress.
              </div>
            </aside>

            <div>
              <StudyPlan plan={plan} onBack={handleBackToForm} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

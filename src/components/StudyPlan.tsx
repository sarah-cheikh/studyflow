import { useEffect, useState } from "react";

interface StudyDay {
  day: number;
  tasks: string[];
}

interface StudyPlanData {
  summary: string;
  days: StudyDay[];
}

interface StudyPlanProps {
  plan: StudyPlanData;
  onBack: () => void;
}

function StudyPlan({ plan, onBack }: StudyPlanProps) {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (day: number, taskIndex: number) => {
    const key = `${day}-${taskIndex}`;
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const totalTasks = plan.days.reduce((sum, day) => sum + day.tasks.length, 0);
  const completedTasks = checkedTasks.size;
  const allTasksDone = totalTasks > 0 && completedTasks === totalTasks;
  const checkboxClasses =
    "mt-0.5 h-3.5 w-3.5 flex-shrink-0 cursor-pointer accent-[#6B3FA0] transition-transform duration-150 hover:scale-110";

  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (!allTasksDone) return;
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 5000);
    return () => clearTimeout(timer);
  }, [allTasksDone]);

  return (
    <div className="animate-[plan-reveal_500ms_ease-out] rounded-2xl border border-[#E4DFD3] bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-[#2B2A28]">
          Your Study Plan
        </h2>

        <button
          type="button"
          onClick={onBack}
          className="rounded px-1 text-xs font-medium text-[#2B2A28] underline underline-offset-2 transition-opacity duration-150 hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3FA0]/40"
        >
          Regenerate plan
        </button>
      </div>

      <p className="mb-3 text-sm text-[#6B6862]">{plan.summary}</p>

      {plan.days.length === 0 ?
        <div className="rounded border border-dashed border-[#E4DFD3] p-6 text-center">
          <p className="mb-1 text-sm font-medium text-[#2B2A28]">
            You're all caught up! 🎉
          </p>
          <p className="text-xs text-[#9A968E]">
            Nothing left to schedule — every chapter is already marked as
            completed.
          </p>
        </div>
      : <>
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-[#6B6862]">
              <span>Progress</span>
              <span>
                {completedTasks} / {totalTasks} tasks completed
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E4DFD3]">
              <div
                className="h-full rounded-full bg-[#6B3FA0] transition-all duration-500 ease-out"
                style={{
                  width:
                    totalTasks === 0 ? "0%" : (
                      `${(completedTasks / totalTasks) * 100}%`
                    ),
                }}
              />
            </div>
          </div>

          {allTasksDone && showToast && (
            <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm animate-[toast-in_400ms_ease-out_forwards] rounded-2xl border border-[#6B3FA0]/30 bg-white px-4 py-3 shadow-lg">
              <div className="flex items-start gap-2">
                <span className="flex-1 text-sm font-medium text-[#4F2E76]">
                  🎉 All tasks done! Great work sticking to the plan.
                </span>
                <button
                  type="button"
                  onClick={() => setShowToast(false)}
                  aria-label="Dismiss"
                  className="flex-shrink-0 rounded px-1 text-[#9A968E] transition-colors duration-150 hover:text-[#2B2A28] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3FA0]/40"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="grid max-h-[45vh] grid-cols-1 gap-2 overflow-y-auto pr-1">
            {plan.days.map((day) => (
              <div
                key={day.day}
                className="flex gap-3 rounded border border-[#E4DFD3] p-3"
              >
                <div className="flex-shrink-0 pt-0.5 font-serif text-lg font-bold leading-none text-[#6B3FA0]">
                  Day {day.day}
                </div>

                <ul className="flex-1 space-y-1 border-l border-[#E4DFD3] pl-3">
                  {day.tasks.map((task, taskIndex) => {
                    const key = `${day.day}-${taskIndex}`;
                    const isChecked = checkedTasks.has(key);

                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-start gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTask(day.day, taskIndex)}
                            className={checkboxClasses}
                          />
                          <span
                            className={`transition-colors duration-200 ${
                              isChecked ?
                                "text-[#9A968E] line-through"
                              : "text-[#6B6862]"
                            }`}
                          >
                            {task}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      }
    </div>
  );
}

export default StudyPlan;

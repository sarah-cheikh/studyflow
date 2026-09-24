import { useState } from "react";

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
  // Tracks completed tasks by a "day-taskIndex" key, e.g. "1-0".
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
    "mt-0.5 h-3.5 w-3.5 flex-shrink-0 cursor-pointer accent-[#343044] transition-transform duration-150 hover:scale-110";

  return (
    <div className="animate-[plan-reveal_500ms_ease-out] rounded-2xl border border-[#e5e1d8] bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#343044]">
          Your Study Plan
        </h2>

        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium text-[#343044] underline underline-offset-2 transition-opacity duration-150 hover:opacity-70"
        >
          Regenerate plan
        </button>
      </div>

      <p className="mb-3 text-sm text-gray-600">{plan.summary}</p>

      {plan.days.length === 0 ?
        <div className="rounded-xl border border-dashed border-[#e5e1d8] p-6 text-center">
          <p className="mb-1 text-sm font-medium text-[#343044]">
            You're all caught up! 🎉
          </p>
          <p className="text-xs text-gray-500">
            Nothing left to schedule — every chapter is already marked as
            completed.
          </p>
        </div>
      : <>
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>
                {completedTasks} / {totalTasks} tasks completed
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e1d8]">
              <div
                className="h-full rounded-full bg-[#343044] transition-all duration-500 ease-out"
                style={{
                  width:
                    totalTasks === 0 ? "0%" : (
                      `${(completedTasks / totalTasks) * 100}%`
                    ),
                }}
              />
            </div>
          </div>

          {allTasksDone && (
            <div className="mb-3 rounded-lg border border-[#DCE3D2] bg-[#EEF1E9] px-3 py-2 text-center text-xs font-medium text-[#4B6350]">
              🎉 All tasks done! Great work sticking to the plan.
            </div>
          )}

          <div className="max-h-[45vh] space-y-2 overflow-y-auto pr-1">
            {plan.days.map((day) => (
              <div
                key={day.day}
                className="rounded-lg border border-[#e5e1d8] p-3"
              >
                <h3 className="mb-1.5 text-sm font-medium text-[#343044]">
                  Day {day.day}
                </h3>

                <ul className="space-y-1">
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
                                "text-gray-400 line-through"
                              : "text-gray-600"
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

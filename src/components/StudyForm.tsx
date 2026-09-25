import { useState } from "react";
import type { StudyFormData } from "../types/Study";
interface StudyPlanData {
  summary: string;
  days: {
    day: number;
    tasks: string[];
  }[];
}

interface StudyFormProps {
  onPlanGenerated: (plan: StudyPlanData) => void;
}

function StudyForm({ onPlanGenerated }: StudyFormProps) {
  const [formData, setFormData] = useState<StudyFormData>({
    subject: "",
    deadline: "",
    material: "",
    hoursPerDay: 0,
    completedChapters: [],
    difficultTopics: "",
  });
  const [chapterInput, setChapterInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      alert("Please enter a subject.");
      return;
    }

    if (!formData.deadline) {
      alert("Please choose a deadline.");
      return;
    }

    if (formData.hoursPerDay <= 0) {
      alert("Hours per day must be greater than 0.");
      return;
    }

    if (!formData.material.trim()) {
      alert("Please add at least one chapter to study.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      console.log("Backend response:", data);

      if (typeof data?.summary !== "string" || !Array.isArray(data?.days)) {
        throw new Error(
          "Received an unexpected response shape from the server.",
        );
      }

      onPlanGenerated(data);
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      setSubmitError(
        error instanceof Error ?
          error.message
        : "Something went wrong while generating your plan. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const chapters = formData.material
    .split("\n")
    .map((chapter) => chapter.trim())
    .filter(Boolean);

  const addChapter = () => {
    const trimmed = chapterInput.trim();
    if (!trimmed || chapters.includes(trimmed)) {
      setChapterInput("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      material: [...chapters, trimmed].join("\n"),
    }));
    setChapterInput("");
  };

  const handleChapterInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChapter();
    }
  };

  const removeChapter = (chapter: string) => {
    setFormData((prev) => ({
      ...prev,
      material: chapters.filter((c) => c !== chapter).join("\n"),
      completedChapters: prev.completedChapters.filter((c) => c !== chapter),
    }));
  };

  const toggleChapterCompleted = (chapter: string) => {
    setFormData((prev) => {
      const isCompleted = prev.completedChapters.includes(chapter);
      return {
        ...prev,
        completedChapters:
          isCompleted ?
            prev.completedChapters.filter((item) => item !== chapter)
          : [...prev.completedChapters, chapter],
      };
    });
  };

  const inputClasses =
    "w-full rounded border border-[#DCD6C8] bg-[#FBFAF6] px-3 py-2 text-sm text-[#2B2A28] outline-none transition-colors duration-200 focus:border-[#6B3FA0] focus:ring-2 focus:ring-[#6B3FA0]/15 placeholder:text-[#9A968E]";
  const labelClasses = "mb-1 block text-sm font-medium text-[#2B2A28]";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#E4DFD3] bg-white p-4 shadow-sm"
    >
      {/* Group 1: what & when */}
      <div className="mb-4 grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="subject" className={labelClasses}>
            What are you studying?
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Database Systems"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="deadline" className={labelClasses}>
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="chapterInput" className={labelClasses}>
          What do you need to study?
        </label>

        <div className="flex gap-2">
          <input
            id="chapterInput"
            type="text"
            value={chapterInput}
            onChange={(e) => setChapterInput(e.target.value)}
            onKeyDown={handleChapterInputKeyDown}
            placeholder="e.g. Chapter 4"
            className={inputClasses}
          />
          <button
            type="button"
            onClick={addChapter}
            className="flex-shrink-0 rounded border border-[#2B2A28]/15 bg-[#2B2A28]/[0.06] px-3 py-2 text-sm font-medium text-[#2B2A28] transition-colors duration-150 hover:bg-[#2B2A28]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3FA0]/40"
          >
            Add
          </button>
        </div>

        {chapters.length === 0 ?
          <p className="mt-1.5 text-xs text-[#9A968E]">
            Press Enter or click Add to add a chapter.
          </p>
        : <>
            <p className="mt-1.5 mb-1 text-xs text-[#9A968E]">
              Check off finished chapters.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {chapters.map((chapter) => {
                const isCompleted =
                  formData.completedChapters.includes(chapter);
                return (
                  <span
                    key={chapter}
                    className={`inline-flex items-center gap-1.5 rounded border py-1 pl-2 pr-1.5 text-xs transition-colors duration-200 ${
                      isCompleted ?
                        "border-[#6B3FA0]/30 bg-[#6B3FA0]/10"
                      : "border-[#DCD6C8] bg-[#FBFAF6]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleChapterCompleted(chapter)}
                      className="h-4 w-4 flex-shrink-0 cursor-pointer accent-[#6B3FA0] transition-transform duration-150 hover:scale-110"
                      aria-label={`Mark ${chapter} as completed`}
                    />
                    <span
                      className={
                        isCompleted ?
                          "text-[#4F2E76] line-through"
                        : "text-[#2B2A28]"
                      }
                    >
                      {chapter}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChapter(chapter)}
                      aria-label={`Remove ${chapter}`}
                      className="ml-0.5 rounded px-1 text-[#9A968E] transition-colors duration-150 hover:text-[#9B4038] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3FA0]/40"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#E4DFD3]">
                <div
                  className="h-full rounded-full bg-[#6B3FA0] transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      (formData.completedChapters.length / chapters.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="flex-shrink-0 text-[11px] text-[#9A968E]">
                {formData.completedChapters.length} / {chapters.length} done
              </span>
            </div>
          </>
        }
      </div>

      <div className="my-3 border-t border-[#E4DFD3]" />

      {/* Group 2: how you'll study it */}
      <div className="mb-3 grid grid-cols-1 gap-2">
        <div>
          <label htmlFor="hoursPerDay" className={labelClasses}>
            Hours / day
          </label>
          <input
            id="hoursPerDay"
            name="hoursPerDay"
            type="number"
            min="0"
            step="0.5"
            value={formData.hoursPerDay || ""}
            onChange={handleNumberChange}
            placeholder="e.g. 2"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="difficultTopics" className={labelClasses}>
            Difficult topics
          </label>
          <input
            id="difficultTopics"
            name="difficultTopics"
            type="text"
            value={formData.difficultTopics}
            onChange={handleChange}
            placeholder="e.g. Chapter 4, Chapter 7"
            className={inputClasses}
          />
        </div>
      </div>

      {submitError && (
        <div className="mb-3 rounded border border-[#F0D6D2] bg-[#FBEEEC] px-3 py-2 text-sm text-[#9B4038]">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-[#6B3FA0] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3FA0]/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
      >
        {isSubmitting ? "Generating your plan..." : "Generate my study plan"}
      </button>
    </form>
  );
}

export default StudyForm;

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
      alert("Please enter the chapters you need to study.");
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

      // Basic shape check so a malformed response doesn't crash StudyPlan
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

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };
  const handleChapterToggle = (chapter: string) => {
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
  const chapters = formData.material
    .split("\n")
    .map((chapter) => chapter.trim())
    .filter(Boolean);

  // Underline-style fields instead of full boxes — quieter, and the
  // focus color-shift gives every field a small, deliberate response.
  const inputClasses =
    "w-full rounded-md border-0 border-b-2 border-[#e5e1d8] bg-[#FCFBF8] px-3 py-2 text-sm text-[#343044] outline-none transition-colors duration-200 focus:border-[#343044] placeholder:text-gray-400";
  const labelClasses = "mb-1 block text-sm font-medium text-[#343044]";
  const checkboxClasses =
    "h-4 w-4 flex-shrink-0 cursor-pointer accent-[#343044] transition-transform duration-150 hover:scale-110";

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        <label htmlFor="material" className={labelClasses}>
          What do you need to study?
        </label>

        <textarea
          id="material"
          name="material"
          value={formData.material}
          onChange={handleChange}
          placeholder={"Chapter 1\nChapter 2\nChapter 3"}
          rows={3}
          className={inputClasses}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

      <div className="mb-4">
        <label className={labelClasses}>
          Which chapters have you completed?
        </label>

        {chapters.length === 0 ?
          <p className="text-sm text-gray-500">
            Enter your chapters above first.
          </p>
        : <div className="max-h-28 space-y-1.5 overflow-y-auto rounded-lg border border-[#e5e1d8] p-2">
            {chapters.map((chapter) => (
              <label key={chapter} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.completedChapters.includes(chapter)}
                  onChange={() => handleChapterToggle(chapter)}
                  className={checkboxClasses}
                />
                <span>{chapter}</span>
              </label>
            ))}
          </div>
        }
      </div>

      {submitError && (
        <div className="mb-4 rounded-lg border border-[#F0D6D2] bg-[#FBEEEC] px-3 py-2 text-sm text-[#9B4038]">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#343044] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
      >
        {isSubmitting ? "Generating your plan..." : "Generate my study plan"}
      </button>
    </form>
  );
}

export default StudyForm;

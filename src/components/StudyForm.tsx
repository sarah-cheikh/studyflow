import { useState } from "react";
import type { StudyFormData } from "../types/Study";

function StudyForm() {
  const [formData, setFormData] = useState<StudyFormData>({
    subject: "",
    deadline: "",
    material: "",
    hoursPerDay: 0,
    completed: 0,
    total: 0,
    difficultTopics: "",
  });
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

    if (formData.completed > formData.total) {
      alert("Completed material cannot be greater than total material.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Backend response:", data);
    } catch (error) {
      console.error("Failed to connect to backend:", error);
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="subject" className="mb-2 block text-sm font-medium">
          What are you studying?
        </label>

        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="e.g. Database Systems"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#343044]"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="deadline" className="mb-2 block text-sm font-medium">
          When is your deadline?
        </label>

        <input
          id="deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#343044]"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="material" className="mb-2 block text-sm font-medium">
          What do you need to study?
        </label>

        <textarea
          id="material"
          name="material"
          value={formData.material}
          onChange={handleChange}
          placeholder={"Chapter 1\nChapter 2\nChapter 3"}
          rows={5}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#343044]"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="hoursPerDay" className="mb-2 block text-sm font-medium">
          How much time can you study each day?
        </label>

        <div className="flex items-center gap-3">
          <input
            id="hoursPerDay"
            name="hoursPerDay"
            type="number"
            min="0"
            step="0.5"
            value={formData.hoursPerDay || ""}
            onChange={handleNumberChange}
            className="w-32 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#343044]"
          />

          <span className="text-gray-600">hours / day</span>
        </div>
      </div>
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">
          How much have you completed?
        </label>

        <div className="flex items-center gap-3">
          <input
            id="completed"
            name="completed"
            type="number"
            min="0"
            value={formData.completed || ""}
            onChange={handleNumberChange}
            className="w-24 rounded-xl border border-gray-300 bg-white px-4 py-3"
          />

          <span className="text-gray-600">out of</span>

          <input
            id="total"
            name="total"
            type="number"
            min="1"
            value={formData.total || ""}
            onChange={handleChange}
            className="w-24 rounded-xl border border-gray-300 bg-white px-4 py-3"
          />

          <span className="text-gray-600">chapters</span>
        </div>
      </div>
      <div className="mb-8">
        <label
          htmlFor="difficultTopics"
          className="mb-2 block text-sm font-medium"
        >
          Which topics are difficult?
        </label>

        <input
          id="difficultTopics"
          name="difficultTopics"
          type="text"
          value={formData.difficultTopics}
          onChange={handleChange}
          placeholder="e.g. Normalization, Transactions"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-[#343044] px-5 py-3 font-medium text-white transition hover:opacity-90"
      >
        Generate my study plan
      </button>
    </form>
  );
}

export default StudyForm;

import { useState } from "react";
import type { StudyFormData } from "../types/study";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="subject" className="mb-2 block text-sm font-medium">
          What are you studying?
        </label>

        <input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) =>
            setFormData({
              ...formData,
              subject: e.target.value,
            })
          }
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
          type="date"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({
              ...formData,
              deadline: e.target.value,
            })
          }
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#343044]"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="material" className="mb-2 block text-sm font-medium">
          What do you need to study?
        </label>

        <textarea
          id="material"
          value={formData.material}
          onChange={(e) =>
            setFormData({
              ...formData,
              material: e.target.value,
            })
          }
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
            type="number"
            min="0"
            step="0.5"
            value={formData.hoursPerDay || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                hoursPerDay: Number(e.target.value),
              })
            }
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
            type="number"
            min="0"
            value={formData.completed || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                completed: Number(e.target.value),
              })
            }
            className="w-24 rounded-xl border border-gray-300 bg-white px-4 py-3"
          />

          <span className="text-gray-600">out of</span>

          <input
            type="number"
            min="1"
            value={formData.total || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                total: Number(e.target.value),
              })
            }
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
          type="text"
          value={formData.difficultTopics}
          onChange={(e) =>
            setFormData({
              ...formData,
              difficultTopics: e.target.value,
            })
          }
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

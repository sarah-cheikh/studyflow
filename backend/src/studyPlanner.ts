export interface StudyData {
  subject: string;
  deadline: string;
  material: string;
  hoursPerDay: number;
  completedChapters: string[];
  difficultTopics: string;
}

export interface StudyDay {
  day: number;
  tasks: string[];
}

export interface StudyPlan {
  summary: string;
  days: StudyDay[];
}

export function generateStudyPlan(data: StudyData): StudyPlan {
  const materials = data.material
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const remainingMaterials = materials.filter(
    (material) => !data.completedChapters.includes(material),
  );

  const days: StudyDay[] = remainingMaterials.map((material, index) => ({
    day: index + 1,
    tasks: [`Study ${material}`],
  }));

  return {
    summary: `You have ${remainingMaterials.length} chapters remaining.`,
    days,
  };
}

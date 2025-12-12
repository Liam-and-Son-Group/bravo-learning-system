// Lesson type options for creation
export const LESSON_TYPES = [
  {
    id: "assessment",
    name: "Assessment",
    description:
      "Create tests, quizzes, and evaluations to measure student understanding",
    icon: "ClipboardCheck",
    color: "blue",
  },
  {
    id: "lesson",
    name: "Lesson",
    description:
      "Build structured learning content with text, media, and interactive elements",
    icon: "BookOpen",
    color: "green",
  },
  {
    id: "puzzle-game",
    name: "Puzzle Game",
    description:
      "Engage students with interactive puzzles and problem-solving activities",
    icon: "Puzzle",
    color: "purple",
  },
  {
    id: "custom-game",
    name: "Custom Template Game",
    description:
      "Design custom game templates with your own rules and mechanics",
    icon: "Gamepad2",
    color: "orange",
  },
] as const;

export type LessonType = (typeof LESSON_TYPES)[number]["id"];

export type CreateLessonFormData = {
  // Step 1: Type selection
  type: LessonType | null;

  // Step 2: Configuration
  name: string;
  mainBranch: string;
  visibility: "public" | "private";
  folderId: string;
};

export const DEFAULT_FORM_DATA: CreateLessonFormData = {
  type: null,
  name: "",
  mainBranch: "main",
  visibility: "private",
  folderId: "",
};

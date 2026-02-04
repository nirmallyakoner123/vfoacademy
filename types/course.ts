export type LessonType = 'Video' | 'PDF' | 'Assessment';

export type CourseStatus = 'Draft' | 'Published' | 'Archived';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Asset {
  id: string;
  name: string;
  type: 'video' | 'pdf' | 'image';
  url?: string;
  size?: number;
  duration?: number; // for videos, in seconds
  uploadedAt?: Date;
}

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  title: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  difficulty: DifficultyLevel;
  marks: number;
  duration: number; // minutes
  category: string;
  topic: string;
  subtopic: string;
  description: string;
  options: AnswerOption[];
  explanation?: string; // Explanation shown after answering
}

// Assessment/Test Configuration
export interface AssessmentConfig {
  id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'exam' | 'practice';
  timeLimit?: number; // in minutes, null for no limit
  maxAttempts: number;
  passingScore: number; // percentage
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: 'immediately' | 'after-submission' | 'after-due-date' | 'never';
  showCorrectAnswers: boolean;
  // Proctoring settings
  proctoring: {
    enabled: boolean;
    copyPasteAllowed: boolean;
    rightClickAllowed: boolean;
    printAllowed: boolean;
    devToolsAllowed: boolean;
    tabSwitchLimit?: number; // null for unlimited
  };
  // External test platform integration
  externalTestId?: string; // ID from 3rd party platform
  externalTestUrl?: string;
  questions: Question[];
  totalMarks: number;
  evaluationDuration?: number; // minutes for manual evaluation
  aiVoice?: string; // AI voice for reading questions
  ogImage?: string; // Social sharing image
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  assets: Asset[];
  assessment?: AssessmentConfig; // For assessment type lessons
  duration?: number; // estimated duration in minutes
  order: number;
  isPreview?: boolean; // Can be viewed without enrollment
}

export interface Week {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
  unlockDate?: Date; // When this week becomes available
  isLocked?: boolean;
}

export interface CourseSettings {
  enrollmentLimit?: number;
  isPublic: boolean;
  allowSelfEnrollment: boolean;
  requireApproval: boolean;
  certificateEnabled: boolean;
  discussionEnabled: boolean;
  downloadableResources: boolean;
}

export interface CourseInstructor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'primary' | 'assistant';
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  previewVideo?: string;
  category: string;
  tags: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  status: CourseStatus;
  instructors: CourseInstructor[];
  weeks: Week[];
  settings: CourseSettings;
  pricing?: {
    isFree: boolean;
    price?: number;
    currency?: string;
    discount?: number;
  };
  learningObjectives: string[];
  prerequisites: string[];
  targetAudience: string[];
  estimatedDuration: number; // total hours
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ValidationRules {
  hasCourseTitle: boolean;
  hasDescription: boolean;
  hasAtLeastOneWeek: boolean;
  hasAtLeastOneLesson: boolean;
  hasAtLeastOneContent: boolean;
  hasThumbnail: boolean;
  hasCategory: boolean;
}

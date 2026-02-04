export type AssessmentType = 'Quiz' | 'Assignment' | 'Exam';

export type AssessmentStatus = 'Draft' | 'Active' | 'Closed';

export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  order: number;
}

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  status: AssessmentStatus;
  courseId: string;
  courseName: string;
  weekId?: string;
  weekName?: string;
  questions: Question[];
  totalPoints: number;
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
  submissions: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'pending' | 'graded' | 'reviewed';
  submittedAt: Date;
  gradedAt?: Date;
  gradedBy?: string;
  feedback?: string;
  answers: {
    questionId: string;
    answer: string | number;
    isCorrect?: boolean;
    pointsAwarded: number;
  }[];
}

export interface AssessmentStats {
  totalAssessments: number;
  activeAssessments: number;
  totalSubmissions: number;
  pendingReview: number;
  averageScore: number;
  passRate: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role: 'learner' | 'admin';
  joinedAt: Date;
  lastActiveAt: Date;
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseName: string;
  courseImage?: string;
  instructorName: string;
  enrolledAt: Date;
  progress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
  lastAccessedAt: Date;
  status: 'in-progress' | 'completed' | 'not-started';
  certificateId?: string;
  dueDate?: Date;
}

export interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  weekId: string;
  weekTitle: string;
  type: 'Video' | 'PDF';
  duration?: number; // in minutes
  completed: boolean;
  completedAt?: Date;
  watchedDuration?: number; // for videos, in seconds
  lastPosition?: number; // for videos, resume position
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  totalProgress: number;
  weeks: {
    weekId: string;
    weekTitle: string;
    progress: number;
    lessons: LessonProgress[];
  }[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  userId: string;
  userName: string;
  issuedAt: Date;
  certificateUrl?: string;
  credentialId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: 'course-completion' | 'streak' | 'assessment' | 'milestone';
}

export interface LearnerStats {
  totalCoursesEnrolled: number;
  coursesCompleted: number;
  coursesInProgress: number;
  totalLearningHours: number;
  currentStreak: number;
  longestStreak: number;
  certificatesEarned: number;
  averageScore: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  read: boolean;
  createdAt: Date;
  link?: string;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  type: 'assignment' | 'quiz' | 'exam' | 'course';
  dueDate: Date;
}

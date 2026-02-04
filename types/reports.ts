export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  averageProgress: number;
  averageScore: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  averageSessionDuration: number;
  retentionRate: number;
}

export interface RevenueData {
  period: string;
  revenue: number;
  enrollments: number;
  refunds: number;
}

export interface EngagementData {
  period: string;
  activeUsers: number;
  lessonsCompleted: number;
  assessmentsTaken: number;
  averageTimeSpent: number;
}

export interface TopPerformer {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  coursesCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  rank: number;
}

export interface ReportFilters {
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate?: Date;
  endDate?: Date;
  courseId?: string;
}

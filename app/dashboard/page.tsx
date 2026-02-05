'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LearnerLayout } from '@/components/learner/LearnerLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import * as enrollmentService from '@/lib/services/enrollment.service';
import { supabase } from '@/lib/supabase/client';

interface EnrolledCourse {
  id: string;
  course_id: string;
  progress_percentage: number | null;
  status: string | null;
  last_accessed_at: string | null;
  enrolled_at: string | null;
  totalLessons: number;
  completedLessons: number;
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    category: string | null;
    level: string | null;
    estimated_duration_hours: number | null;
    weeks: Array<{
      id: string;
      title: string;
      lessons: Array<{
        id: string;
        title: string;
        type: string;
      }>;
    }>;
  };
}

interface LearnerStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  coursesInProgress: number;
  certificates: number;
  averageProgress: number;
}

export default function LearnerDashboard() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<LearnerStats | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
          
          if (profile?.full_name) {
            setUserName(profile.full_name.split(' ')[0]); // First name only
          }
        }

        // Get enrollments
        const enrollmentsResult = await enrollmentService.getMyEnrollments();
        if (enrollmentsResult.success && enrollmentsResult.data) {
          setEnrollments(enrollmentsResult.data as EnrolledCourse[]);
        }

        // Get stats
        const statsResult = await enrollmentService.getLearnerStats();
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get courses in progress for "Continue Watching"
  const continueWatching = enrollments
    .filter(e => e.status === 'active' && (e.progress_percentage || 0) > 0 && (e.progress_percentage || 0) < 100)
    .slice(0, 2);

  // Get recent courses for "My Courses" section
  const recentCourses = enrollments.slice(0, 3);

  const formatLastAccessed = (dateString: string | null) => {
    if (!dateString) return 'Not started';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffHours < 48) return 'Yesterday';
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  if (isLoading) {
    return (
      <LearnerLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-[var(--primary-navy)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[var(--gray-500)]">Loading your dashboard...</span>
          </div>
        </div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[var(--primary-navy)] to-[var(--primary-navy-light)] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">{greeting()}, {userName || 'Learner'}!</h1>
            <p className="text-white/80 text-lg mb-6">
              {enrollments.length > 0 
                ? 'Ready to continue your learning journey?' 
                : 'Welcome! You have no courses enrolled yet.'}
            </p>
            
            <div className="flex flex-wrap gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{stats?.coursesEnrolled || 0}</p>
                <p className="text-white/70 text-sm">Courses Enrolled</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{stats?.coursesInProgress || 0}</p>
                <p className="text-white/70 text-sm">In Progress</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{stats?.coursesCompleted || 0}</p>
                <p className="text-white/70 text-sm">Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{stats?.certificates || 0}</p>
                <p className="text-white/70 text-sm">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Continue Learning</h2>
              <Link href="/courses" className="text-sm text-[var(--primary-navy)] hover:underline font-medium">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {continueWatching.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.course_id}`}
                  className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden hover:shadow-lg hover:border-[var(--primary-navy-light)] transition-all group"
                >
                  <div className="flex">
                    <div className="w-48 h-32 bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-navy-light)] flex-shrink-0 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-5">
                      <p className="text-xs text-[var(--gray-500)] mb-1">{enrollment.course?.category || 'General'}</p>
                      <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary-navy)] transition-colors line-clamp-1">
                        {enrollment.course?.title}
                      </h3>
                      <p className="text-sm text-[var(--gray-500)] mb-3">
                        {enrollment.completedLessons}/{enrollment.totalLessons} lessons completed
                      </p>
                      <div className="flex items-center justify-between">
                        <ProgressBar value={enrollment.progress_percentage || 0} size="sm" variant="primary" className="flex-1 mr-4" />
                        <span className="text-sm font-medium text-[var(--gray-600)]">{enrollment.progress_percentage || 0}%</span>
                      </div>
                      <p className="text-xs text-[var(--gray-400)] mt-2">{formatLastAccessed(enrollment.last_accessed_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">My Courses</h2>
              <Link href="/courses" className="text-sm text-[var(--primary-navy)] hover:underline font-medium">
                View All ({stats?.coursesEnrolled || 0})
              </Link>
            </div>
            
            {recentCourses.length === 0 ? (
              <div className="bg-white rounded-xl border border-[var(--gray-200)] p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-[var(--gray-300)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No courses yet</h3>
                <p className="text-[var(--gray-500)]">
                  You haven't been enrolled in any courses yet. Contact your administrator to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCourses.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${enrollment.course_id}`}
                    className="block bg-white rounded-xl border border-[var(--gray-200)] p-5 hover:shadow-md hover:border-[var(--primary-navy-light)] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-accent-dark)] rounded-xl flex-shrink-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs font-medium text-[var(--primary-navy)] bg-blue-50 px-2 py-1 rounded-full">
                              {enrollment.course?.category || 'General'}
                            </span>
                            <h3 className="font-semibold text-[var(--foreground)] mt-2">{enrollment.course?.title}</h3>
                            <p className="text-sm text-[var(--gray-500)]">{enrollment.course?.level || 'All Levels'}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-bold text-[var(--primary-navy)]">{enrollment.progress_percentage || 0}%</p>
                            <p className="text-xs text-[var(--gray-500)]">
                              {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                            </p>
                          </div>
                        </div>
                        <ProgressBar
                          value={enrollment.progress_percentage || 0}
                          variant={enrollment.status === 'completed' ? 'success' : 'primary'}
                          size="md"
                          className="mt-4"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-accent-dark)] rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Courses Completed</span>
                    <span className="font-semibold">{stats?.coursesCompleted || 0}/{stats?.coursesEnrolled || 0}</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full" 
                      style={{ 
                        width: `${stats?.coursesEnrolled ? (stats.coursesCompleted / stats.coursesEnrolled) * 100 : 0}%` 
                      }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Progress</span>
                    <span className="font-semibold">{stats?.averageProgress || 0}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full" 
                      style={{ width: `${stats?.averageProgress || 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--gray-200)] flex items-center justify-between">
                <h3 className="font-semibold text-[var(--foreground)]">Certificates</h3>
                <Link href="/certificates" className="text-sm text-[var(--primary-navy)] hover:underline">
                  View All
                </Link>
              </div>
              <div className="p-5">
                {(stats?.certificates || 0) > 0 ? (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)]">{stats?.certificates}</p>
                    <p className="text-sm text-[var(--gray-500)]">Certificate{stats?.certificates !== 1 ? 's' : ''} Earned</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-[var(--gray-100)] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <p className="text-sm text-[var(--gray-500)]">Complete courses to earn certificates</p>
                  </div>
                )}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-white rounded-xl border border-[var(--gray-200)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-2">Need Help?</h3>
              <p className="text-sm text-[var(--gray-500)] mb-4">
                Having trouble with your courses? Contact support for assistance.
              </p>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 text-sm text-[var(--primary-navy)] hover:underline font-medium"
              >
                Get Support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LearnerLayout>
  );
}

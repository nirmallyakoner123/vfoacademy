'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LearnerLayout } from '@/components/learner/LearnerLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs } from '@/components/ui/Tabs';
import { SearchInput } from '@/components/ui/SearchInput';
import * as enrollmentService from '@/lib/services/enrollment.service';

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
        duration_minutes: number | null;
      }>;
    }>;
  };
}

const categoryColors: Record<string, string> = {
  Programming: 'bg-blue-100 text-blue-700',
  'Web Development': 'bg-purple-100 text-purple-700',
  'Data Science': 'bg-green-100 text-green-700',
  Film: 'bg-amber-100 text-amber-700',
  General: 'bg-gray-100 text-gray-700',
};

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name'>('recent');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setIsLoading(true);
        const result = await enrollmentService.getMyEnrollments();
        
        if (result.success && result.data) {
          setEnrollments(result.data as EnrolledCourse[]);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Calculate stats
  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter(e => e.status === 'active' && (e.progress_percentage || 0) < 100).length,
    completed: enrollments.filter(e => e.status === 'completed' || (e.progress_percentage || 0) === 100).length,
  };

  const tabs = [
    { id: 'all', label: 'All Courses', count: stats.total },
    { id: 'in-progress', label: 'In Progress', count: stats.inProgress },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  const filteredCourses = enrollments
    .filter((enrollment) => {
      const isCompleted = enrollment.status === 'completed' || (enrollment.progress_percentage || 0) === 100;
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'in-progress' && !isCompleted) ||
        (activeTab === 'completed' && isCompleted);

      const matchesSearch =
        searchQuery === '' ||
        enrollment.course?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enrollment.course?.category?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        const dateA = a.last_accessed_at ? new Date(a.last_accessed_at).getTime() : 0;
        const dateB = b.last_accessed_at ? new Date(b.last_accessed_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'progress') {
        return (b.progress_percentage || 0) - (a.progress_percentage || 0);
      }
      return (a.course?.title || '').localeCompare(b.course?.title || '');
    });

  // Calculate total duration from lessons
  const getTotalDuration = (enrollment: EnrolledCourse) => {
    if (enrollment.course?.estimated_duration_hours) {
      return `${enrollment.course.estimated_duration_hours}h`;
    }
    const totalMinutes = enrollment.course?.weeks?.reduce((sum, week) => 
      sum + (week.lessons?.reduce((lessonSum, lesson) => 
        lessonSum + (lesson.duration_minutes || 0), 0) || 0), 0) || 0;
    
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <LearnerLayout title="My Courses">
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-[var(--primary-navy)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[var(--gray-500)]">Loading your courses...</span>
          </div>
        </div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout title="My Courses">
      <div className="p-6 lg:p-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
                <p className="text-sm text-[var(--gray-500)]">Enrolled Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.inProgress}</p>
                <p className="text-sm text-[var(--gray-500)]">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.completed}</p>
                <p className="text-sm text-[var(--gray-500)]">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[var(--gray-200)] mb-6">
          <div className="px-6 pt-4">
            <Tabs tabs={tabs} defaultTab="all" onChange={setActiveTab} />
          </div>
          <div className="p-6 border-t border-[var(--gray-200)] flex flex-col sm:flex-row gap-4">
            <SearchInput
              placeholder="Search courses..."
              onSearch={setSearchQuery}
              className="sm:w-80"
            />
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-[var(--gray-500)]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'progress' | 'name')}
                className="px-3 py-2 rounded-lg border border-[var(--gray-300)] text-sm focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20"
              >
                <option value="recent">Recently Accessed</option>
                <option value="progress">Progress</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--gray-300)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              {enrollments.length === 0 ? 'No courses enrolled' : 'No courses found'}
            </h3>
            <p className="text-[var(--gray-500)] mb-6">
              {enrollments.length === 0 
                ? 'You haven\'t been enrolled in any courses yet. Contact your administrator to get started.'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((enrollment) => {
              const isCompleted = enrollment.status === 'completed' || (enrollment.progress_percentage || 0) === 100;
              const category = enrollment.course?.category || 'General';
              
              return (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.course_id}`}
                  className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden hover:shadow-lg hover:border-[var(--primary-navy-light)] transition-all group"
                >
                  {/* Course Thumbnail */}
                  <div className="h-40 bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-navy-light)] relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-[var(--primary-navy)] ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[category] || categoryColors['General']}`}>
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary-navy)] transition-colors line-clamp-1">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-sm text-[var(--gray-500)] mb-4 line-clamp-2">
                      {enrollment.course?.description || 'No description available'}
                    </p>

                    {/* Level */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-[var(--gray-100)] text-[var(--gray-600)] px-2 py-1 rounded-full">
                        {enrollment.course?.level || 'All Levels'}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[var(--gray-500)]">
                          {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                        </span>
                        <span className="font-semibold text-[var(--foreground)]">{enrollment.progress_percentage || 0}%</span>
                      </div>
                      <ProgressBar
                        value={enrollment.progress_percentage || 0}
                        variant={isCompleted ? 'success' : 'primary'}
                        size="sm"
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--gray-100)]">
                      <div className="flex items-center gap-1 text-sm text-[var(--gray-500)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getTotalDuration(enrollment)}
                      </div>
                      <span className="text-sm text-[var(--gray-500)]">
                        {enrollment.course?.weeks?.length || 0} weeks
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </LearnerLayout>
  );
}

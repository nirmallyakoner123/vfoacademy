'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LearnerLayout } from '@/components/learner/LearnerLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tabs } from '@/components/ui/Tabs';
import { SearchInput } from '@/components/ui/SearchInput';

// Mock data
const enrolledCourses = [
  {
    id: 'course_1',
    title: 'Python Fundamentals',
    description: 'Learn Python programming from scratch with hands-on projects',
    instructor: 'Dr. Sarah Chen',
    instructorAvatar: '',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    totalDuration: '12h 30m',
    category: 'Programming',
    status: 'in-progress' as const,
    lastAccessed: new Date('2026-02-04'),
    enrolledAt: new Date('2026-01-15'),
    rating: 4.8,
    studentsCount: 2456,
  },
  {
    id: 'course_2',
    title: 'Web Development Bootcamp',
    description: 'Complete web development course covering HTML, CSS, JavaScript and React',
    instructor: 'John Smith',
    instructorAvatar: '',
    progress: 42,
    totalLessons: 36,
    completedLessons: 15,
    totalDuration: '24h 15m',
    category: 'Web Development',
    status: 'in-progress' as const,
    lastAccessed: new Date('2026-02-03'),
    enrolledAt: new Date('2026-01-20'),
    rating: 4.7,
    studentsCount: 3891,
  },
  {
    id: 'course_3',
    title: 'Data Science Essentials',
    description: 'Introduction to data science, statistics, and machine learning basics',
    instructor: 'Dr. Michael Brown',
    instructorAvatar: '',
    progress: 18,
    totalLessons: 28,
    completedLessons: 5,
    totalDuration: '16h 45m',
    category: 'Data Science',
    status: 'in-progress' as const,
    lastAccessed: new Date('2026-02-01'),
    enrolledAt: new Date('2026-01-25'),
    rating: 4.9,
    studentsCount: 1823,
  },
  {
    id: 'course_4',
    title: 'Introduction to Film Production',
    description: 'Learn the fundamentals of film production and cinematography',
    instructor: 'Emily Davis',
    instructorAvatar: '',
    progress: 100,
    totalLessons: 18,
    completedLessons: 18,
    totalDuration: '8h 20m',
    category: 'Film',
    status: 'completed' as const,
    lastAccessed: new Date('2026-01-28'),
    enrolledAt: new Date('2025-12-10'),
    rating: 4.6,
    studentsCount: 945,
    certificateId: 'cert_123',
  },
  {
    id: 'course_5',
    title: 'Video Editing Masterclass',
    description: 'Professional video editing techniques using industry-standard tools',
    instructor: 'James Wilson',
    instructorAvatar: '',
    progress: 100,
    totalLessons: 22,
    completedLessons: 22,
    totalDuration: '14h 10m',
    category: 'Film',
    status: 'completed' as const,
    lastAccessed: new Date('2026-01-20'),
    enrolledAt: new Date('2025-11-15'),
    rating: 4.8,
    studentsCount: 1567,
    certificateId: 'cert_456',
  },
];

const tabs = [
  { id: 'all', label: 'All Courses', count: 5 },
  { id: 'in-progress', label: 'In Progress', count: 3 },
  { id: 'completed', label: 'Completed', count: 2 },
];

const categoryColors: Record<string, string> = {
  Programming: 'bg-blue-100 text-blue-700',
  'Web Development': 'bg-purple-100 text-purple-700',
  'Data Science': 'bg-green-100 text-green-700',
  Film: 'bg-amber-100 text-amber-700',
};

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'name'>('recent');

  const filteredCourses = enrolledCourses
    .filter((course) => {
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'in-progress' && course.status === 'in-progress') ||
        (activeTab === 'completed' && course.status === 'completed');

      const matchesSearch =
        searchQuery === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
      }
      if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
      return a.title.localeCompare(b.title);
    });

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
                <p className="text-2xl font-bold text-[var(--foreground)]">{enrolledCourses.length}</p>
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
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {enrolledCourses.filter((c) => c.status === 'in-progress').length}
                </p>
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
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {enrolledCourses.filter((c) => c.status === 'completed').length}
                </p>
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
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No courses found</h3>
            <p className="text-[var(--gray-500)] mb-6">Try adjusting your search or filters</p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary-navy)] text-white rounded-xl font-medium hover:bg-[var(--primary-navy-dark)] transition-colors"
            >
              Browse Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
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
                  {course.status === 'completed' && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[course.category] || 'bg-gray-100 text-gray-700'}`}>
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary-navy)] transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-[var(--gray-500)] mb-4 line-clamp-2">{course.description}</p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--gray-200)] flex items-center justify-center text-xs font-semibold text-[var(--gray-600)]">
                      {course.instructor.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-sm text-[var(--gray-600)]">{course.instructor}</span>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[var(--gray-500)]">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                      <span className="font-semibold text-[var(--foreground)]">{course.progress}%</span>
                    </div>
                    <ProgressBar
                      value={course.progress}
                      variant={course.progress === 100 ? 'success' : 'primary'}
                      size="sm"
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--gray-100)]">
                    <div className="flex items-center gap-1 text-sm text-[var(--gray-500)]">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {course.rating}
                    </div>
                    <span className="text-sm text-[var(--gray-500)]">{course.totalDuration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </LearnerLayout>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

// Mock course data
const courseData = {
  id: 'course_1',
  title: 'Python Fundamentals',
  description: 'Learn Python programming from scratch with hands-on projects. This comprehensive course covers everything from basic syntax to advanced concepts like object-oriented programming and file handling.',
  instructor: {
    name: 'Dr. Sarah Chen',
    title: 'Senior Software Engineer',
    avatar: '',
    bio: '10+ years of experience in Python development and teaching.',
  },
  progress: 65,
  totalLessons: 24,
  completedLessons: 16,
  totalDuration: '12h 30m',
  rating: 4.8,
  studentsCount: 2456,
  lastUpdated: 'January 2026',
  weeks: [
    {
      id: 'week_1',
      title: 'Week 1: Getting Started',
      description: 'Introduction to Python and setting up your environment',
      progress: 100,
      lessons: [
        { id: 'lesson_1', title: 'Welcome to Python', type: 'Video', duration: '8:24', completed: true },
        { id: 'lesson_2', title: 'Installing Python', type: 'Video', duration: '12:15', completed: true },
        { id: 'lesson_3', title: 'Your First Program', type: 'Video', duration: '15:30', completed: true },
        { id: 'lesson_4', title: 'Week 1 Quiz', type: 'Quiz', duration: '10 min', completed: true },
      ],
    },
    {
      id: 'week_2',
      title: 'Week 2: Data Types & Variables',
      description: 'Understanding Python data types and working with variables',
      progress: 75,
      lessons: [
        { id: 'lesson_5', title: 'Variables and Data Types', type: 'Video', duration: '18:45', completed: true },
        { id: 'lesson_6', title: 'Working with Strings', type: 'Video', duration: '22:10', completed: true },
        { id: 'lesson_7', title: 'Numbers and Math', type: 'Video', duration: '16:30', completed: true, current: true },
        { id: 'lesson_8', title: 'Lists and Dictionaries', type: 'Video', duration: '25:00', completed: false },
        { id: 'lesson_9', title: 'Week 2 Assignment', type: 'Assignment', duration: '30 min', completed: false },
      ],
    },
    {
      id: 'week_3',
      title: 'Week 3: Control Flow',
      description: 'Conditional statements and loops',
      progress: 0,
      lessons: [
        { id: 'lesson_10', title: 'If Statements', type: 'Video', duration: '14:20', completed: false },
        { id: 'lesson_11', title: 'For Loops', type: 'Video', duration: '18:45', completed: false },
        { id: 'lesson_12', title: 'While Loops', type: 'Video', duration: '12:30', completed: false },
        { id: 'lesson_13', title: 'Practice Exercises', type: 'PDF', duration: '20 min', completed: false },
        { id: 'lesson_14', title: 'Week 3 Quiz', type: 'Quiz', duration: '15 min', completed: false },
      ],
    },
    {
      id: 'week_4',
      title: 'Week 4: Functions',
      description: 'Creating and using functions in Python',
      progress: 0,
      lessons: [
        { id: 'lesson_15', title: 'Introduction to Functions', type: 'Video', duration: '20:15', completed: false },
        { id: 'lesson_16', title: 'Parameters and Arguments', type: 'Video', duration: '16:40', completed: false },
        { id: 'lesson_17', title: 'Return Values', type: 'Video', duration: '14:25', completed: false },
        { id: 'lesson_18', title: 'Lambda Functions', type: 'Video', duration: '12:10', completed: false },
        { id: 'lesson_19', title: 'Week 4 Project', type: 'Assignment', duration: '45 min', completed: false },
      ],
    },
  ],
};

const getLessonIcon = (type: string, completed: boolean) => {
  if (completed) {
    return (
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  const iconMap: Record<string, React.ReactNode> = {
    Video: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
      </svg>
    ),
    Quiz: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Assignment: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    PDF: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className="w-8 h-8 bg-[var(--gray-100)] rounded-full flex items-center justify-center text-[var(--gray-500)]">
      {iconMap[type] || iconMap.Video}
    </div>
  );
};

export default function CourseViewerPage() {
  const params = useParams();
  // params will be used when fetching real course data
  void params;
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>(['week_1', 'week_2']);
  const [selectedLesson, setSelectedLesson] = useState<string | null>('lesson_7');

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekId) ? prev.filter((id) => id !== weekId) : [...prev, weekId]
    );
  };

  const currentLesson = courseData.weeks
    .flatMap((w) => w.lessons)
    .find((l) => l.id === selectedLesson);

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-[var(--gray-200)] px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/courses"
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-[var(--foreground)]">{courseData.title}</h1>
              <p className="text-sm text-[var(--gray-500)]">{courseData.instructor.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-[var(--gray-500)]">
                {courseData.completedLessons}/{courseData.totalLessons} lessons
              </span>
              <div className="w-32">
                <ProgressBar value={courseData.progress} size="sm" variant="primary" />
              </div>
              <span className="text-sm font-semibold text-[var(--primary-navy)]">{courseData.progress}%</span>
            </div>
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Course Content */}
        <aside className="w-80 bg-white border-r border-[var(--gray-200)] h-[calc(100vh-65px)] overflow-y-auto sticky top-[65px] flex-shrink-0">
          <div className="p-4">
            <h2 className="font-semibold text-[var(--foreground)] mb-4">Course Content</h2>
            <div className="space-y-2">
              {courseData.weeks.map((week) => (
                <div key={week.id} className="border border-[var(--gray-200)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleWeek(week.id)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-[var(--gray-50)] hover:bg-[var(--gray-100)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 text-[var(--gray-500)] transition-transform ${expandedWeeks.includes(week.id) ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="text-left">
                        <p className="text-sm font-medium text-[var(--foreground)]">{week.title}</p>
                        <p className="text-xs text-[var(--gray-500)]">{week.lessons.length} lessons</p>
                      </div>
                    </div>
                    {week.progress === 100 ? (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-[var(--gray-500)]">{week.progress}%</span>
                    )}
                  </button>
                  {expandedWeeks.includes(week.id) && (
                    <div className="border-t border-[var(--gray-200)]">
                      {week.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson.id)}
                          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--gray-50)] transition-colors ${
                            selectedLesson === lesson.id ? 'bg-blue-50 border-l-2 border-[var(--primary-navy)]' : ''
                          }`}
                        >
                          {getLessonIcon(lesson.type, lesson.completed)}
                          <div className="flex-1 text-left min-w-0">
                            <p className={`text-sm truncate ${lesson.completed ? 'text-[var(--gray-500)]' : 'text-[var(--foreground)]'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-xs text-[var(--gray-400)]">{lesson.duration}</p>
                          </div>
                          {lesson.current && (
                            <span className="text-xs bg-[var(--primary-navy)] text-white px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Video Player */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4 text-white">
                <button className="hover:text-[var(--gold-accent)] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--gold-accent)] rounded-full" style={{ width: '35%' }} />
                </div>
                <span className="text-sm">5:48 / 16:30</span>
                <button className="hover:text-[var(--gold-accent)] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 0112.728 0" />
                  </svg>
                </button>
                <button className="hover:text-[var(--gold-accent)] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-sm text-[var(--primary-navy)] font-medium">Week 2 • Lesson 3</span>
                <h2 className="text-2xl font-bold text-[var(--foreground)] mt-1">
                  {currentLesson?.title || 'Numbers and Math'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Bookmark
                </Button>
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </Button>
              </div>
            </div>
            <p className="text-[var(--gray-600)] mb-6">
              In this lesson, you&apos;ll learn how to work with numbers in Python, including integers, floats, and complex numbers. We&apos;ll cover arithmetic operations, type conversion, and useful math functions.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--gray-500)]">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                16:30 duration
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                1,234 views
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Lesson
            </Button>
            <Button variant="primary">
              Mark as Complete
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
            <Button variant="outline">
              Next Lesson
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

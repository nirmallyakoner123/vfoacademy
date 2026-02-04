'use client';

import React from 'react';
import Link from 'next/link';
import { LearnerLayout } from '@/components/learner/LearnerLayout';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';

// Mock data
const learnerStats = {
  coursesEnrolled: 5,
  coursesCompleted: 2,
  hoursLearned: 47,
  currentStreak: 7,
  certificates: 2,
  averageScore: 85,
};

const continueWatching = [
  {
    id: 'course_1',
    title: 'Python Fundamentals',
    lesson: 'Working with Lists and Dictionaries',
    week: 'Week 2',
    progress: 65,
    thumbnail: '/course-python.jpg',
    duration: '12:34',
    lastWatched: '2 hours ago',
  },
  {
    id: 'course_2',
    title: 'Web Development Bootcamp',
    lesson: 'Introduction to CSS Grid',
    week: 'Week 3',
    progress: 42,
    thumbnail: '/course-web.jpg',
    duration: '18:22',
    lastWatched: 'Yesterday',
  },
];

const enrolledCourses = [
  {
    id: 'course_1',
    title: 'Python Fundamentals',
    instructor: 'Dr. Sarah Chen',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    thumbnail: '/course-python.jpg',
    category: 'Programming',
  },
  {
    id: 'course_2',
    title: 'Web Development Bootcamp',
    instructor: 'John Smith',
    progress: 42,
    totalLessons: 36,
    completedLessons: 15,
    thumbnail: '/course-web.jpg',
    category: 'Web Development',
  },
  {
    id: 'course_3',
    title: 'Data Science Essentials',
    instructor: 'Dr. Michael Brown',
    progress: 18,
    totalLessons: 28,
    completedLessons: 5,
    thumbnail: '/course-data.jpg',
    category: 'Data Science',
  },
];

const upcomingDeadlines = [
  {
    id: '1',
    title: 'Python Quiz - Week 2',
    course: 'Python Fundamentals',
    type: 'quiz',
    dueDate: new Date('2026-02-06'),
    daysLeft: 2,
  },
  {
    id: '2',
    title: 'CSS Grid Assignment',
    course: 'Web Development Bootcamp',
    type: 'assignment',
    dueDate: new Date('2026-02-10'),
    daysLeft: 6,
  },
  {
    id: '3',
    title: 'Data Analysis Project',
    course: 'Data Science Essentials',
    type: 'project',
    dueDate: new Date('2026-02-15'),
    daysLeft: 11,
  },
];

const achievements = [
  { id: '1', icon: '🎯', title: 'First Course', description: 'Completed your first course' },
  { id: '2', icon: '🔥', title: '7 Day Streak', description: 'Learned for 7 days in a row' },
  { id: '3', icon: '⭐', title: 'Top Performer', description: 'Scored 90%+ on an assessment' },
  { id: '4', icon: '📚', title: 'Bookworm', description: 'Completed 10 lessons' },
];

export default function LearnerDashboard() {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <LearnerLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[var(--primary-navy)] to-[var(--primary-navy-light)] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">{greeting()}, John! 👋</h1>
            <p className="text-white/80 text-lg mb-6">Ready to continue your learning journey?</p>
            
            <div className="flex flex-wrap gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{learnerStats.currentStreak}</p>
                <p className="text-white/70 text-sm">Day Streak 🔥</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{learnerStats.hoursLearned}h</p>
                <p className="text-white/70 text-sm">Hours Learned</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{learnerStats.certificates}</p>
                <p className="text-white/70 text-sm">Certificates</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                <p className="text-3xl font-bold">{learnerStats.averageScore}%</p>
                <p className="text-white/70 text-sm">Avg. Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Continue Watching</h2>
              <Link href="/courses" className="text-sm text-[var(--primary-navy)] hover:underline font-medium">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {continueWatching.map((item) => (
                <Link
                  key={item.id}
                  href={`/courses/${item.id}`}
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
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {item.duration}
                      </div>
                    </div>
                    <div className="flex-1 p-5">
                      <p className="text-xs text-[var(--gray-500)] mb-1">{item.week}</p>
                      <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary-navy)] transition-colors">
                        {item.lesson}
                      </h3>
                      <p className="text-sm text-[var(--gray-500)] mb-3">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <ProgressBar value={item.progress} size="sm" variant="primary" className="flex-1 mr-4" />
                        <span className="text-sm font-medium text-[var(--gray-600)]">{item.progress}%</span>
                      </div>
                      <p className="text-xs text-[var(--gray-400)] mt-2">{item.lastWatched}</p>
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
                View All ({learnerStats.coursesEnrolled})
              </Link>
            </div>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
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
                            {course.category}
                          </span>
                          <h3 className="font-semibold text-[var(--foreground)] mt-2">{course.title}</h3>
                          <p className="text-sm text-[var(--gray-500)]">{course.instructor}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-[var(--primary-navy)]">{course.progress}%</p>
                          <p className="text-xs text-[var(--gray-500)]">
                            {course.completedLessons}/{course.totalLessons} lessons
                          </p>
                        </div>
                      </div>
                      <ProgressBar
                        value={course.progress}
                        variant={course.progress === 100 ? 'success' : 'primary'}
                        size="md"
                        className="mt-4"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse More Courses
            </Button>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--gray-200)]">
                <h3 className="font-semibold text-[var(--foreground)]">Upcoming Deadlines</h3>
              </div>
              <div className="p-4 space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--gray-50)] transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        deadline.type === 'quiz'
                          ? 'bg-blue-100 text-blue-600'
                          : deadline.type === 'assignment'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {deadline.type === 'quiz' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : deadline.type === 'assignment' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[var(--foreground)] truncate">{deadline.title}</p>
                      <p className="text-xs text-[var(--gray-500)]">{deadline.course}</p>
                      <p
                        className={`text-xs font-medium mt-1 ${
                          deadline.daysLeft <= 2 ? 'text-[var(--error)]' : 'text-[var(--gray-500)]'
                        }`}
                      >
                        {deadline.daysLeft === 0
                          ? 'Due today!'
                          : deadline.daysLeft === 1
                          ? 'Due tomorrow'
                          : `${deadline.daysLeft} days left`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--gray-200)] flex items-center justify-between">
                <h3 className="font-semibold text-[var(--foreground)]">Recent Achievements</h3>
                <Link href="/achievements" className="text-sm text-[var(--primary-navy)] hover:underline">
                  View All
                </Link>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-3 rounded-xl bg-[var(--gray-50)] hover:bg-[var(--gray-100)] transition-colors text-center"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <p className="text-xs font-medium text-[var(--foreground)] mt-1">{achievement.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-accent-dark)] rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-4">Your Progress This Week</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Lessons Completed</span>
                    <span className="font-semibold">8/10</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Weekly Goal</span>
                    <span className="font-semibold">5h / 7h</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LearnerLayout>
  );
}

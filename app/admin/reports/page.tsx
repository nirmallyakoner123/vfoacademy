'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';

// Mock data
const overviewStats = {
  totalRevenue: 125840,
  totalEnrollments: 2847,
  activeStudents: 1923,
  completionRate: 68.5,
  averageRating: 4.7,
  totalCourses: 12,
};

const revenueData = [
  { month: 'Aug', value: 8500 },
  { month: 'Sep', value: 12300 },
  { month: 'Oct', value: 15600 },
  { month: 'Nov', value: 11200 },
  { month: 'Dec', value: 18900 },
  { month: 'Jan', value: 22400 },
  { month: 'Feb', value: 19800 },
];

const coursePerformance = [
  { id: '1', name: 'Python Fundamentals', enrollments: 856, completionRate: 72, revenue: 42800, rating: 4.8 },
  { id: '2', name: 'Advanced Python', enrollments: 423, completionRate: 58, revenue: 31725, rating: 4.6 },
  { id: '3', name: 'Web Development Bootcamp', enrollments: 612, completionRate: 65, revenue: 36720, rating: 4.7 },
  { id: '4', name: 'Data Science Essentials', enrollments: 389, completionRate: 71, revenue: 23340, rating: 4.9 },
  { id: '5', name: 'Machine Learning Basics', enrollments: 234, completionRate: 54, revenue: 17550, rating: 4.5 },
];

const topStudents = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', coursesCompleted: 8, avgScore: 94.5, timeSpent: 156 },
  { id: '2', name: 'Michael Chen', email: 'mchen@email.com', coursesCompleted: 7, avgScore: 92.3, timeSpent: 142 },
  { id: '3', name: 'Emily Davis', email: 'emily.d@email.com', coursesCompleted: 6, avgScore: 91.8, timeSpent: 128 },
  { id: '4', name: 'James Wilson', email: 'jwilson@email.com', coursesCompleted: 6, avgScore: 89.7, timeSpent: 134 },
  { id: '5', name: 'Lisa Anderson', email: 'lisa.a@email.com', coursesCompleted: 5, avgScore: 88.9, timeSpent: 118 },
];

const engagementByDay = [
  { day: 'Mon', users: 423, lessons: 1256 },
  { day: 'Tue', users: 512, lessons: 1489 },
  { day: 'Wed', users: 478, lessons: 1367 },
  { day: 'Thu', users: 534, lessons: 1523 },
  { day: 'Fri', users: 389, lessons: 1134 },
  { day: 'Sat', users: 267, lessons: 823 },
  { day: 'Sun', users: 234, lessons: 712 },
];

const dateRangeOptions = [
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'quarter', label: 'Last 3 months' },
  { value: 'year', label: 'Last 12 months' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');

  const maxRevenue = Math.max(...revenueData.map((d) => d.value));
  const maxEngagement = Math.max(...engagementByDay.map((d) => d.users));

  return (
    <AdminLayout
      title="Reports & Analytics"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Reports' }]}
    >
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header with Date Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Analytics Overview</h2>
            <p className="text-sm text-[var(--gray-500)] mt-1">
              Track your platform performance and student engagement
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              className="w-48"
            />
            <Button variant="outline">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${overviewStats.totalRevenue.toLocaleString()}`}
            variant="success"
            trend={{ value: 18.2, isPositive: true }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Enrollments"
            value={overviewStats.totalEnrollments.toLocaleString()}
            variant="primary"
            trend={{ value: 12.5, isPositive: true }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
          />
          <StatCard
            title="Active Students"
            value={overviewStats.activeStudents.toLocaleString()}
            variant="primary"
            trend={{ value: 8.3, isPositive: true }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Completion Rate"
            value={`${overviewStats.completionRate}%`}
            variant="warning"
            trend={{ value: 5.2, isPositive: true }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Avg. Rating"
            value={overviewStats.averageRating.toFixed(1)}
            subtitle="out of 5.0"
            variant="success"
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            }
          />
          <StatCard
            title="Total Courses"
            value={overviewStats.totalCourses}
            variant="default"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Revenue Trend</h3>
                <p className="text-sm text-[var(--gray-500)]">Monthly revenue over time</p>
              </div>
              <Badge variant="success">+18.2%</Badge>
            </div>
            <div className="h-64 flex items-end gap-3">
              {revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[var(--gray-100)] rounded-t-lg relative overflow-hidden" style={{ height: '200px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--primary-navy)] to-[var(--primary-navy-light)] rounded-t-lg transition-all duration-500"
                      style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--gray-500)]">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Chart */}
          <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Weekly Engagement</h3>
                <p className="text-sm text-[var(--gray-500)]">Active users by day of week</p>
              </div>
              <Badge variant="info">This Week</Badge>
            </div>
            <div className="h-64 flex items-end gap-3">
              {engagementByDay.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[var(--gray-100)] rounded-t-lg relative overflow-hidden" style={{ height: '200px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[var(--gold-accent)] to-[var(--gold-accent-light)] rounded-t-lg transition-all duration-500"
                      style={{ height: `${(item.users / maxEngagement) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--gray-500)]">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Performance & Top Students */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--gray-200)] shadow-sm">
            <div className="px-6 py-5 border-b border-[var(--gray-200)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Course Performance</h3>
              <p className="text-sm text-[var(--gray-500)]">Top performing courses by enrollment</p>
            </div>
            <div className="p-6">
              <div className="space-y-5">
                {coursePerformance.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-navy)] text-white flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[var(--foreground)] truncate">{course.name}</h4>
                        <span className="text-sm font-semibold text-[var(--foreground)]">
                          ${course.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--gray-500)]">
                        <span>{course.enrollments} enrolled</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {course.rating}
                        </span>
                      </div>
                      <ProgressBar
                        value={course.completionRate}
                        variant={course.completionRate >= 70 ? 'success' : course.completionRate >= 50 ? 'warning' : 'error'}
                        size="sm"
                        className="mt-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Students */}
          <div className="bg-white rounded-xl border border-[var(--gray-200)] shadow-sm">
            <div className="px-6 py-5 border-b border-[var(--gray-200)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Top Performers</h3>
              <p className="text-sm text-[var(--gray-500)]">Students with highest scores</p>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--gray-50)] transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-navy-light)] text-white flex items-center justify-center font-semibold text-sm">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      {index < 3 && (
                        <div
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? 'bg-amber-400 text-amber-900'
                              : index === 1
                              ? 'bg-gray-300 text-gray-700'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--foreground)] truncate">{student.name}</p>
                      <p className="text-xs text-[var(--gray-500)]">
                        {student.coursesCompleted} courses • {student.avgScore}% avg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{student.avgScore}%</p>
                      <p className="text-xs text-[var(--gray-500)]">{student.timeSpent}h</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                View All Students
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Quick Reports</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-4 p-4 rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-[var(--gray-50)] transition-all group">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Revenue Report</p>
                <p className="text-sm text-[var(--gray-500)]">Download PDF</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-[var(--gray-50)] transition-all group">
              <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">User Analytics</p>
                <p className="text-sm text-[var(--gray-500)]">Export CSV</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-[var(--gray-50)] transition-all group">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Assessment Report</p>
                <p className="text-sm text-[var(--gray-500)]">View Details</p>
              </div>
            </button>
            <button className="flex items-center gap-4 p-4 rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-[var(--gray-50)] transition-all group">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-[var(--foreground)]">Schedule Report</p>
                <p className="text-sm text-[var(--gray-500)]">Set up automation</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

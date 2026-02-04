'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { StatCard } from '@/components/ui/StatCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { Assessment, AssessmentStats } from '@/types/assessment';

// Mock data for demonstration
const mockAssessments: Assessment[] = [
  {
    id: 'assess_1',
    title: 'Python Fundamentals Quiz',
    description: 'Test your knowledge of Python basics',
    type: 'Quiz',
    status: 'Active',
    courseId: 'course_1',
    courseName: 'Python Course',
    weekId: 'week_1',
    weekName: 'Week 1',
    questions: [],
    totalPoints: 100,
    passingScore: 70,
    timeLimit: 30,
    attempts: 156,
    submissions: 142,
    averageScore: 78.5,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-20'),
    dueDate: new Date('2026-02-28'),
  },
  {
    id: 'assess_2',
    title: 'Data Structures Assignment',
    description: 'Implement common data structures',
    type: 'Assignment',
    status: 'Active',
    courseId: 'course_1',
    courseName: 'Python Course',
    weekId: 'week_2',
    weekName: 'Week 2',
    questions: [],
    totalPoints: 150,
    passingScore: 90,
    attempts: 89,
    submissions: 67,
    averageScore: 82.3,
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-22'),
    dueDate: new Date('2026-03-15'),
  },
  {
    id: 'assess_3',
    title: 'Midterm Examination',
    description: 'Comprehensive exam covering weeks 1-4',
    type: 'Exam',
    status: 'Draft',
    courseId: 'course_1',
    courseName: 'Python Course',
    questions: [],
    totalPoints: 200,
    passingScore: 120,
    timeLimit: 120,
    attempts: 0,
    submissions: 0,
    averageScore: 0,
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    id: 'assess_4',
    title: 'OOP Concepts Quiz',
    description: 'Object-oriented programming principles',
    type: 'Quiz',
    status: 'Closed',
    courseId: 'course_1',
    courseName: 'Python Course',
    weekId: 'week_3',
    weekName: 'Week 3',
    questions: [],
    totalPoints: 80,
    passingScore: 56,
    timeLimit: 25,
    attempts: 134,
    submissions: 134,
    averageScore: 71.2,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-28'),
  },
  {
    id: 'assess_5',
    title: 'File Handling Assignment',
    description: 'Working with files in Python',
    type: 'Assignment',
    status: 'Active',
    courseId: 'course_2',
    courseName: 'Advanced Python',
    weekId: 'week_1',
    weekName: 'Week 1',
    questions: [],
    totalPoints: 100,
    passingScore: 70,
    attempts: 45,
    submissions: 38,
    averageScore: 85.6,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-26'),
    dueDate: new Date('2026-02-20'),
  },
];

const mockStats: AssessmentStats = {
  totalAssessments: 24,
  activeAssessments: 12,
  totalSubmissions: 1847,
  pendingReview: 23,
  averageScore: 76.8,
  passRate: 84.2,
};

const tabs = [
  { id: 'all', label: 'All Assessments', count: 24 },
  { id: 'active', label: 'Active', count: 12 },
  { id: 'draft', label: 'Drafts', count: 5 },
  { id: 'closed', label: 'Closed', count: 7 },
];

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Quiz', label: 'Quiz' },
  { value: 'Assignment', label: 'Assignment' },
  { value: 'Exam', label: 'Exam' },
];

const courseOptions = [
  { value: '', label: 'All Courses' },
  { value: 'course_1', label: 'Python Course' },
  { value: 'course_2', label: 'Advanced Python' },
  { value: 'course_3', label: 'Web Development' },
];

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const getStatusBadge = (status: Assessment['status']) => {
    const variants: Record<Assessment['status'], 'success' | 'warning' | 'draft'> = {
      Active: 'success',
      Draft: 'draft',
      Closed: 'warning',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeBadge = (type: Assessment['type']) => {
    const variants: Record<Assessment['type'], 'info' | 'video' | 'error'> = {
      Quiz: 'info',
      Assignment: 'video',
      Exam: 'error',
    };
    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  const filteredAssessments = mockAssessments.filter((assessment) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && assessment.status === 'Active') ||
      (activeTab === 'draft' && assessment.status === 'Draft') ||
      (activeTab === 'closed' && assessment.status === 'Closed');

    const matchesSearch =
      searchQuery === '' ||
      assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === '' || assessment.type === typeFilter;
    const matchesCourse = courseFilter === '' || assessment.courseId === courseFilter;

    return matchesTab && matchesSearch && matchesType && matchesCourse;
  });

  const columns = [
    {
      key: 'title',
      header: 'Assessment',
      render: (assessment: Assessment) => (
        <div>
          <p className="font-semibold text-[var(--foreground)] mb-1">{assessment.title}</p>
          <p className="text-sm text-[var(--gray-500)]">{assessment.courseName}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '120px',
      render: (assessment: Assessment) => getTypeBadge(assessment.type),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (assessment: Assessment) => getStatusBadge(assessment.status),
    },
    {
      key: 'submissions',
      header: 'Submissions',
      width: '140px',
      render: (assessment: Assessment) => (
        <div>
          <p className="font-medium text-[var(--foreground)]">
            {assessment.submissions}/{assessment.attempts}
          </p>
          <p className="text-xs text-[var(--gray-500)]">
            {assessment.attempts > 0
              ? `${((assessment.submissions / assessment.attempts) * 100).toFixed(0)}% completion`
              : 'No attempts'}
          </p>
        </div>
      ),
    },
    {
      key: 'averageScore',
      header: 'Avg. Score',
      width: '120px',
      render: (assessment: Assessment) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-[var(--gray-200)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                assessment.averageScore >= assessment.passingScore / assessment.totalPoints * 100
                  ? 'bg-green-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${assessment.averageScore}%` }}
            />
          </div>
          <span className="text-sm font-medium w-12 text-right">
            {assessment.averageScore > 0 ? `${assessment.averageScore}%` : '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      width: '140px',
      render: (assessment: Assessment) => (
        <span className="text-sm text-[var(--gray-600)]">
          {assessment.dueDate
            ? new Date(assessment.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: () => (
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-[var(--gray-500)] hover:text-[var(--primary-navy)] hover:bg-[var(--gray-100)] rounded-lg transition-colors"
            title="View details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="p-2 text-[var(--gray-500)] hover:text-[var(--primary-navy)] hover:bg-[var(--gray-100)] rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Assessments"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Assessments' }]}
    >
      <div className="p-6 lg:p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Assessments"
            value={mockStats.totalAssessments}
            subtitle={`${mockStats.activeAssessments} active`}
            variant="primary"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
          <StatCard
            title="Total Submissions"
            value={mockStats.totalSubmissions.toLocaleString()}
            subtitle={`${mockStats.pendingReview} pending review`}
            variant="success"
            trend={{ value: 12.5, isPositive: true }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Average Score"
            value={`${mockStats.averageScore}%`}
            subtitle="Across all assessments"
            variant="warning"
            trend={{ value: 3.2, isPositive: true }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <StatCard
            title="Pass Rate"
            value={`${mockStats.passRate}%`}
            subtitle="Students passing"
            variant="success"
            trend={{ value: 5.8, isPositive: true }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-xl border border-[var(--gray-200)] shadow-sm">
          <div className="px-6 pt-4">
            <Tabs tabs={tabs} defaultTab="all" onChange={setActiveTab} />
          </div>

          <div className="p-6 border-t border-[var(--gray-200)]">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <SearchInput
                placeholder="Search assessments..."
                onSearch={setSearchQuery}
                className="lg:w-80"
              />
              <div className="flex flex-1 gap-4">
                <Select
                  options={typeOptions}
                  value={typeFilter}
                  onChange={setTypeFilter}
                  placeholder="All Types"
                />
                <Select
                  options={courseOptions}
                  value={courseFilter}
                  onChange={setCourseFilter}
                  placeholder="All Courses"
                />
              </div>
              <Button variant="primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Assessment
              </Button>
            </div>

            {/* Table */}
            <Table
              columns={columns}
              data={filteredAssessments}
              emptyMessage="No assessments found"
            />

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--gray-200)]">
              <p className="text-sm text-[var(--gray-500)]">
                Showing <span className="font-medium">{filteredAssessments.length}</span> of{' '}
                <span className="font-medium">{mockAssessments.length}</span> assessments
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-[var(--primary-navy)] text-white border-[var(--primary-navy)]">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

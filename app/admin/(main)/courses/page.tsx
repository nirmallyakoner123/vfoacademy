'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

// Mock Data
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Introduction to Cinematography',
    description: 'Learn the basics of lighting, framing, and camera movement.',
    status: 'Published',
    modules: 4,
    lessons: 24,
    students: 156,
    lastUpdated: '2 days ago',
    thumbnail: 'bg-blue-100'
  },
  {
    id: 2,
    title: 'Advanced Lighting Techniques',
    description: 'Master the art of lighting for different moods and genres.',
    status: 'Draft',
    modules: 6,
    lessons: 18,
    students: 0,
    lastUpdated: '5 hours ago',
    thumbnail: 'bg-yellow-100'
  },
  {
    id: 3,
    title: 'Sound Design Fundamentals',
    description: 'Understanding audio recording, mixing, and sound effects.',
    status: 'Published',
    modules: 5,
    lessons: 32,
    students: 89,
    lastUpdated: '1 week ago',
    thumbnail: 'bg-purple-100'
  },
  {
    id: 4,
    title: 'Post-Production Workflow',
    description: 'Efficient editing workflows for professional filmmakers.',
    status: 'Draft',
    modules: 3,
    lessons: 12,
    students: 0,
    lastUpdated: '1 month ago',
    thumbnail: 'bg-green-100'
  },
  {
    id: 5,
    title: 'Directing Actors',
    description: 'How to communicate effectively with talent on set.',
    status: 'Published',
    modules: 8,
    lessons: 45,
    students: 210,
    lastUpdated: '3 days ago',
    thumbnail: 'bg-red-100'
  }
];

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesTab = activeTab === 'All' || course.status === activeTab;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Courses</h1>
          <p className="text-[var(--gray-500)]">Manage and organize your learning content</p>
        </div>
        <Link href="/admin/courses/create">
          <Button variant="primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Course
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--gray-200)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[var(--gray-100)] p-1 rounded-lg">
            {['All', 'Published', 'Draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-1.5 text-sm font-medium rounded-md transition-all
                  ${activeTab === tab 
                    ? 'bg-white text-[var(--foreground)] shadow-sm' 
                    : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              className="py-2 text-sm" // Override generic input styles for compact toolbar
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Content</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Students</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--gray-500)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--gray-200)] bg-white">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-[var(--gray-50)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${course.thumbnail} flex items-center justify-center text-[var(--primary-navy)]`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--foreground)]">{course.title}</div>
                          <div className="text-sm text-[var(--gray-500)] max-w-xs truncate">{course.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={course.status === 'Published' ? 'published' : 'draft'}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--foreground)]">{course.modules} Modules</div>
                      <div className="text-xs text-[var(--gray-500)]">{course.lessons} Lessons</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
                          ))}
                        </div>
                        <span className="text-sm text-[var(--gray-600)]">
                          {course.students > 0 ? `+${course.students - 3}` : '0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-500)]">
                      {course.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-[var(--gray-500)] hover:text-[var(--primary-navy)] hover:bg-blue-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-2 text-[var(--gray-500)] hover:text-[var(--error)] hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--gray-500)]">
                    No courses found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import * as courseService from '@/lib/services/course.service';
import { toast } from 'react-hot-toast';

type CourseWithCounts = courseService.CourseWithCounts;

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch courses
  useEffect(() => {
    let isMounted = true;
    
    const fetchCourses = async () => {
      setIsLoading(true);
      
      try {
        const filters: { status?: string; search?: string } = {};
        
        if (activeTab !== 'all') {
          filters.status = activeTab;
        }
        
        if (debouncedSearch) {
          filters.search = debouncedSearch;
        }

        const result = await courseService.getCoursesWithCounts(filters);
        
        if (!isMounted) return;
        
        if (result.success && result.data) {
          setCourses(result.data);
        } else {
          console.error('Failed to fetch courses:', result.error);
          toast.error('Failed to load courses');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCourses();
    
    return () => {
      isMounted = false;
    };
  }, [activeTab, debouncedSearch]);

  // Handle delete course
  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(courseId);
    try {
      const result = await courseService.deleteCourse(courseId);
      if (result.success) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        toast.success('Course deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete course');
      }
    } catch (error) {
      toast.error('Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Get status badge variant
  const getStatusVariant = (status: string | null): 'published' | 'draft' | 'archived' => {
    switch (status) {
      case 'published': return 'published';
      case 'archived': return 'archived';
      default: return 'draft';
    }
  };

  // Get thumbnail color based on category or index
  const getThumbnailColor = (index: number) => {
    const colors = ['bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-green-100', 'bg-red-100', 'bg-indigo-100', 'bg-pink-100'];
    return colors[index % colors.length];
  };

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
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {[
              { key: 'all', label: 'All' },
              { key: 'published', label: 'Published' },
              { key: 'draft', label: 'Draft' },
              { key: 'archived', label: 'Archived' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`
                  px-4 py-1.5 text-sm font-medium rounded-md transition-all
                  ${activeTab === tab.key 
                    ? 'bg-white text-[var(--foreground)] shadow-sm' 
                    : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'
                  }
                `}
              >
                {tab.label}
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
              className="py-2 text-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-[var(--primary-navy)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--gray-50)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--gray-600)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gray-200)]">
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <tr key={course.id} className="hover:bg-[var(--gray-50)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${getThumbnailColor(index)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {course.thumbnail_url ? (
                              <img 
                                src={course.thumbnail_url} 
                                alt={course.title} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <svg className="w-6 h-6 text-[var(--gray-500)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <Link 
                              href={`/admin/courses/${course.id}/edit`}
                              className="font-medium text-[var(--foreground)] hover:text-[var(--primary-navy)] transition-colors"
                            >
                              {course.title}
                            </Link>
                            <p className="text-sm text-[var(--gray-500)] line-clamp-1">
                              {course.category || 'Uncategorized'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(course.status)}>
                          {course.status || 'draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--gray-600)]">
                        {course.weeks_count} weeks, {course.lessons_count} lessons
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--gray-600)]">
                        {course.enrollments_count} students
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--gray-500)]">
                        {formatDate(course.updated_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/courses/${course.id}/edit`}>
                            <button className="p-2 text-[var(--gray-500)] hover:text-[var(--primary-navy)] hover:bg-[var(--gray-100)] rounded-lg transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDelete(course.id, course.title)}
                            disabled={deletingId === course.id}
                            className="p-2 text-[var(--gray-500)] hover:text-[var(--error)] hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === course.id ? (
                              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-[var(--gray-100)] rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--foreground)] mb-1">
                          {searchQuery 
                            ? 'No courses found' 
                            : activeTab === 'draft' 
                              ? "Your draft board is empty!" 
                              : "No courses yet"}
                        </h3>
                        <p className="text-[var(--gray-500)] mb-4">
                          {searchQuery 
                            ? 'Try adjusting your search or filters.'
                            : activeTab === 'draft' 
                              ? "Ready to share your knowledge? Create a new course to get started." 
                              : "Create your first course to get started."}
                        </p>
                        {!searchQuery && (
                          <Link href="/admin/courses/create">
                            <Button variant="primary">Create First Course</Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

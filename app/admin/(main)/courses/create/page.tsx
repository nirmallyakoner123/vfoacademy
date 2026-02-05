'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as courseService from '@/lib/services/course.service';
import { useAuth } from '@/lib/contexts/auth-context';
import { toast } from 'react-hot-toast';

export default function CourseCreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');

  // Create course and redirect to edit page
  const handleCreate = async () => {
    if (!user) {
      toast.error('You must be logged in to create a course');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a course title');
      return;
    }

    setIsCreating(true);

    try {
      const result = await courseService.createCourse({
        title: title.trim(),
        status: 'draft',
        level: 'Beginner',
        language: 'English',
        created_by: user.id,
        category: category,
      });

      if (result.success && result.data) {
        toast.success('Course created! Redirecting to editor...');
        router.push(`/admin/courses/${result.data.id}/edit`);
      } else {
        toast.error(result.error || 'Failed to create course');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      setIsCreating(false);
    }
  };

  // Quick create with default title
  const handleQuickCreate = async () => {
    if (!user) {
      toast.error('You must be logged in to create a course');
      return;
    }

    setIsCreating(true);

    try {
      const result = await courseService.createCourse({
        title: 'Untitled Course',
        status: 'draft',
        level: 'Beginner',
        language: 'English',
        created_by: user.id,
        category: 'General',
      });

      if (result.success && result.data) {
        router.push(`/admin/courses/${result.data.id}/edit`);
      } else {
        toast.error(result.error || 'Failed to create course');
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-[var(--gray-200)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary-navy)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--primary-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Create New Course</h1>
            <p className="text-[var(--gray-500)] mt-2">Start building your course content</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Course Title
              </label>
              <Input
                placeholder="e.g., Introduction to Film Production"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={category === 'Other (Add New)' ? 'Other (Add New)' : category}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Other (Add New)') {
                      setCategory('');
                      // You might want a separate state for 'isCustomCategory' to toggle the input
                    } else {
                      setCategory(val);
                    }
                  }}
                  disabled={isCreating}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--gray-300)] focus:ring-2 focus:ring-[var(--primary-navy)] focus:border-transparent appearance-none bg-white"
                >
                  <option value="General">General</option>
                  <option value="Film Production">Film Production</option>
                  <option value="Cinematography">Cinematography</option>
                  <option value="Sound Design">Sound Design</option>
                  <option value="Post-Production">Post-Production</option>
                  <option value="Directing">Directing</option>
                  <option value="Screenwriting">Screenwriting</option>
                  <option value="Other (Add New)">+ Add New Category</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {(!['General', 'Film Production', 'Cinematography', 'Sound Design', 'Post-Production', 'Directing', 'Screenwriting'].includes(category) || category === '') && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Input
                    placeholder="Enter new category name..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isCreating}
                    autoFocus
                  />
                  <p className="text-xs text-[var(--gray-500)] mt-1">This will be added as a custom category.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCreate}
                disabled={isCreating || !title.trim()}
                isLoading={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Course'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--gray-200)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[var(--gray-500)]">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleQuickCreate}
                disabled={isCreating}
              >
                Quick Start (Untitled Course)
              </Button>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/admin/courses')}
              className="text-sm text-[var(--gray-500)] hover:text-[var(--gray-700)]"
            >
              ← Back to Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

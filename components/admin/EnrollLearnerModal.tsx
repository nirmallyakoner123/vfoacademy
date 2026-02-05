'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as enrollmentService from '@/lib/services/enrollment.service';
import toast from 'react-hot-toast';

interface Learner {
  id: string;
  full_name: string | null;
  email: string | null;
  employee_id: string | null;
  department: string | null;
}

interface Course {
  id: string;
  title: string;
  thumbnail_url: string | null;
  category: string | null;
  status: string;
}

interface EnrollLearnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

export const EnrollLearnerModal: React.FC<EnrollLearnerModalProps> = ({
  isOpen,
  onClose,
  onEnroll,
}) => {
  const [step, setStep] = useState<'course' | 'learners'>('course');
  const [courses, setCourses] = useState<Course[]>([]);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<Set<string>>(new Set());
  const [courseSearch, setCourseSearch] = useState('');
  const [learnerSearch, setLearnerSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      // Reset state when modal opens
      setStep('course');
      setSelectedCourse(null);
      setSelectedLearnerIds(new Set());
      setCourseSearch('');
      setLearnerSearch('');
    }
  }, [isOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [coursesResult, learnersResult] = await Promise.all([
        enrollmentService.getPublishedCourses(),
        enrollmentService.getAllLearners(),
      ]);

      if (coursesResult.success && coursesResult.data) {
        setCourses(coursesResult.data);
      }
      if (learnersResult.success && learnersResult.data) {
        setLearners(learnersResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    (course.category?.toLowerCase() || '').includes(courseSearch.toLowerCase())
  );

  const filteredLearners = learners.filter(learner =>
    (learner.full_name?.toLowerCase() || '').includes(learnerSearch.toLowerCase()) ||
    (learner.email?.toLowerCase() || '').includes(learnerSearch.toLowerCase()) ||
    (learner.department?.toLowerCase() || '').includes(learnerSearch.toLowerCase())
  );

  const toggleLearner = (learnerId: string) => {
    setSelectedLearnerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(learnerId)) {
        newSet.delete(learnerId);
      } else {
        newSet.add(learnerId);
      }
      return newSet;
    });
  };

  const toggleAllLearners = () => {
    if (selectedLearnerIds.size === filteredLearners.length) {
      setSelectedLearnerIds(new Set());
    } else {
      setSelectedLearnerIds(new Set(filteredLearners.map(l => l.id)));
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourse || selectedLearnerIds.size === 0) {
      toast.error('Please select a course and at least one learner');
      return;
    }

    setIsEnrolling(true);
    try {
      const result = await enrollmentService.bulkEnrollLearners(
        selectedCourse.id,
        Array.from(selectedLearnerIds)
      );

      if (result.success) {
        toast.success(result.message || 'Learners enrolled successfully');
        onEnroll();
        onClose();
      } else {
        toast.error(result.error || 'Failed to enroll learners');
      }
    } catch (error) {
      console.error('Error enrolling learners:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsEnrolling(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'course' ? 'Select Course' : `Enroll Learners - ${selectedCourse?.title}`}
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-[var(--primary-navy)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : step === 'course' ? (
        <div className="space-y-4">
          <Input
            placeholder="Search courses..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          {filteredCourses.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-[var(--gray-300)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-[var(--gray-500)]">
                {courseSearch ? 'No courses found matching your search.' : 'No published courses available.'}
              </p>
              <p className="text-sm text-[var(--gray-400)] mt-1">
                Make sure you have published courses before enrolling learners.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setStep('learners');
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--gray-200)] hover:border-[var(--primary-navy)] hover:bg-[var(--gray-50)] transition-all text-left"
                >
                  <div className="w-16 h-12 bg-gradient-to-br from-[var(--primary-navy)] to-[var(--primary-navy-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--foreground)] truncate">{course.title}</h4>
                    <p className="text-sm text-[var(--gray-500)]">{course.category || 'General'}</p>
                  </div>
                  <svg className="w-5 h-5 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Back button and search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep('course')}
              className="p-2 hover:bg-[var(--gray-100)] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <Input
              placeholder="Search learners..."
              value={learnerSearch}
              onChange={(e) => setLearnerSearch(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              className="flex-1"
            />
          </div>

          {/* Select all */}
          {filteredLearners.length > 0 && (
            <div className="flex items-center justify-between px-2">
              <button
                onClick={toggleAllLearners}
                className="text-sm text-[var(--primary-navy)] hover:underline font-medium"
              >
                {selectedLearnerIds.size === filteredLearners.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-sm text-[var(--gray-500)]">
                {selectedLearnerIds.size} selected
              </span>
            </div>
          )}

          {/* Learners list */}
          {filteredLearners.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-[var(--gray-300)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-[var(--gray-500)]">
                {learnerSearch ? 'No learners found matching your search.' : 'No learners available.'}
              </p>
              <p className="text-sm text-[var(--gray-400)] mt-1">
                Add learners from the Users page first.
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredLearners.map((learner) => {
                const isSelected = selectedLearnerIds.has(learner.id);
                return (
                  <button
                    key={learner.id}
                    onClick={() => toggleLearner(learner.id)}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left
                      ${isSelected 
                        ? 'border-[var(--primary-navy)] bg-blue-50' 
                        : 'border-[var(--gray-200)] hover:border-[var(--gray-300)] hover:bg-[var(--gray-50)]'
                      }
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${isSelected 
                        ? 'bg-[var(--primary-navy)] border-[var(--primary-navy)]' 
                        : 'border-[var(--gray-300)]'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-navy)] text-white flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                      {getInitials(learner.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--foreground)] truncate">{learner.full_name || 'Unknown'}</h4>
                      <p className="text-sm text-[var(--gray-500)] truncate">{learner.email}</p>
                    </div>
                    {learner.department && (
                      <span className="text-xs bg-[var(--gray-100)] text-[var(--gray-600)] px-2 py-1 rounded-full flex-shrink-0">
                        {learner.department}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Enroll button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--gray-200)]">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleEnroll}
              disabled={selectedLearnerIds.size === 0 || isEnrolling}
            >
              {isEnrolling ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enrolling...
                </>
              ) : (
                <>
                  Enroll {selectedLearnerIds.size} Learner{selectedLearnerIds.size !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

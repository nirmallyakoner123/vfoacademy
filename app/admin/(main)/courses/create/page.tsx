'use client';

import React, { useState, useEffect, useId } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { WeekAccordion } from '@/components/admin/WeekAccordion';
import { AddWeekModal } from '@/components/admin/AddWeekModal';
import { PropertiesPanel } from '@/components/admin/PropertiesPanel';
import { Course, Week, Lesson, Asset, Question, LessonType, AssessmentConfig } from '@/types/course';
import { saveCourse, loadCourse } from '@/lib/storage';

const defaultCourseSettings = {
  isPublic: true,
  allowSelfEnrollment: true,
  requireApproval: false,
  certificateEnabled: true,
  discussionEnabled: true,
  downloadableResources: true,
};

const createInitialCourse = (id: string): Course => ({
  id,
  title: '',
  subtitle: '',
  description: '',
  category: '',
  tags: [],
  level: 'All Levels',
  language: 'English',
  status: 'Draft',
  instructors: [],
  weeks: [
    { id: 'week_1', title: 'Week 1', description: '', lessons: [], order: 1 },
    { id: 'week_2', title: 'Week 2', description: '', lessons: [], order: 2 },
    { id: 'week_3', title: 'Week 3', description: '', lessons: [], order: 3 },
    { id: 'week_4', title: 'Week 4', description: '', lessons: [], order: 4 },
  ],
  settings: defaultCourseSettings,
  learningObjectives: [],
  prerequisites: [],
  targetAudience: [],
  estimatedDuration: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export default function CourseCreatePage() {
  const uniqueId = useId();
  const [course, setCourse] = useState<Course>(() => {
    // Try to load from localStorage during initialization
    if (typeof window !== 'undefined') {
      const saved = loadCourse();
      if (saved) return saved;
    }
    return createInitialCourse(`course_${uniqueId}`);
  });
  
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCourse(course);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [course]);
  
  const handleAddWeek = (title: string, description: string) => {
    const newWeek: Week = {
      id: 'week_' + Date.now(),
      title,
      description,
      lessons: [],
      order: course.weeks.length + 1,
    };
    
    setCourse({
      ...course,
      weeks: [...course.weeks, newWeek],
      updatedAt: new Date(),
    });
  };
  
  const handleAddLesson = (weekId: string, title: string, type: LessonType) => {
    setCourse({
      ...course,
      weeks: course.weeks.map((week) => {
        if (week.id === weekId) {
          const newLesson: Lesson = {
            id: 'lesson_' + Date.now(),
            title,
            type,
            assets: [],
            order: week.lessons.length + 1,
          };
          return {
            ...week,
            lessons: [...week.lessons, newLesson],
          };
        }
        return week;
      }),
      updatedAt: new Date(),
    });
  };
  
  const handleDeleteLesson = (weekId: string, lessonId: string) => {
    setCourse({
      ...course,
      weeks: course.weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            lessons: week.lessons.filter((lesson) => lesson.id !== lessonId),
          };
        }
        return week;
      }),
      updatedAt: new Date(),
    });
    
    if (selectedLessonId === lessonId) {
      setSelectedLessonId(null);
    }
  };
  
  const handleUploadContent = (
    weekId: string,
    lessonId: string,
    fileName: string,
    fileType: 'video' | 'pdf'
  ) => {
    const newAsset: Asset = {
      id: 'asset_' + Date.now(),
      name: fileName,
      type: fileType,
      uploadedAt: new Date(),
    };
    
    setCourse({
      ...course,
      weeks: course.weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            lessons: week.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                return {
                  ...lesson,
                  assets: [...lesson.assets, newAsset],
                };
              }
              return lesson;
            }),
          };
        }
        return week;
      }),
      updatedAt: new Date(),
    });
  };
  
  const handleUpdateWeek = (weekId: string, updates: Partial<Week>) => {
    setCourse({
      ...course,
      weeks: course.weeks.map((week) =>
        week.id === weekId ? { ...week, ...updates } : week
      ),
      updatedAt: new Date(),
    });
  };
  
  const handleUpdateLesson = (lessonId: string, updates: Partial<Lesson>) => {
    setCourse({
      ...course,
      weeks: course.weeks.map((week) => ({
        ...week,
        lessons: week.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        ),
      })),
      updatedAt: new Date(),
    });
  };

  const handleAddQuestion = (lessonId: string, question: Question) => {
    setCourse({
      ...course,
      weeks: course.weeks.map((week) => ({
        ...week,
        lessons: week.lessons.map((lesson) => {
          if (lesson.id === lessonId && lesson.assessment) {
            return {
              ...lesson,
              assessment: {
                ...lesson.assessment,
                questions: [...lesson.assessment.questions, question],
                totalMarks: lesson.assessment.totalMarks + question.marks,
              },
            };
          }
          return lesson;
        }),
      })),
      updatedAt: new Date(),
    });
  };

  const handleDeleteQuestion = (lessonId: string, questionId: string) => {
    setCourse({
      ...course,
      weeks: course.weeks.map((week) => ({
        ...week,
        lessons: week.lessons.map((lesson) => {
          if (lesson.id === lessonId && lesson.assessment) {
            const questionToDelete = lesson.assessment.questions.find(q => q.id === questionId);
            return {
              ...lesson,
              assessment: {
                ...lesson.assessment,
                questions: lesson.assessment.questions.filter((q) => q.id !== questionId),
                totalMarks: lesson.assessment.totalMarks - (questionToDelete?.marks || 0),
              },
            };
          }
          return lesson;
        }),
      })),
      updatedAt: new Date(),
    });
  };

  const handleConfigureAssessment = (
    weekId: string,
    lessonId: string,
    config: AssessmentConfig
  ) => {
    setCourse({
      ...course,
      weeks: course.weeks.map((week) => {
        if (week.id === weekId) {
          return {
            ...week,
            lessons: week.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                return {
                  ...lesson,
                  title: config.title || lesson.title,
                  assessment: config,
                };
              }
              return lesson;
            }),
          };
        }
        return week;
      }),
      updatedAt: new Date(),
    });
  };
  
  const handleSaveDraft = () => {
    setIsSaving(true);
    saveCourse(course);
    setTimeout(() => {
      setIsSaving(false);
      alert('Draft saved successfully!');
    }, 500);
  };
  
  const handlePublish = () => {
    setCourse({
      ...course,
      status: 'Published',
      updatedAt: new Date(),
    });
    saveCourse({ ...course, status: 'Published' });
    alert('Course published successfully!');
  };
  
  // Validation rules
  const hasCourseTitle = course.title.trim().length > 0;
  const hasAtLeastOneLesson = course.weeks.some((week) => week.lessons.length > 0);
  const hasAtLeastOneContent = course.weeks.some((week) =>
    week.lessons.some((lesson) => lesson.assets.length > 0)
  );
  
  const canPublish = hasCourseTitle && hasAtLeastOneLesson && hasAtLeastOneContent;
  
  const selectedWeek = selectedWeekId
    ? course.weeks.find((w) => w.id === selectedWeekId) || null
    : null;
    
  const selectedLesson = selectedLessonId
    ? course.weeks
        .flatMap((w) => w.lessons)
        .find((l) => l.id === selectedLessonId) || null
    : null;

  const [activeTab, setActiveTab] = useState('curriculum');

  const TABS = [
    { id: 'curriculum', label: 'Curriculum', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'details', label: 'Course Details', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'settings', label: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky Header with Title and Actions */}
      <div className="bg-white border-b border-[var(--gray-200)] px-8 py-5 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4 flex-1">
           <div className="flex-1 max-w-2xl">
            <Input
              placeholder="Enter course title..."
              value={course.title}
              onChange={(e) =>
                setCourse({ ...course, title: e.target.value, updatedAt: new Date() })
              }
              className="text-xl md:text-2xl font-bold border-0 px-0 focus:ring-0 shadow-none bg-transparent"
            />
          </div>
          <Badge variant={course.status === 'Published' ? 'published' : 'draft'}>
            {course.status}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleSaveDraft}
            isLoading={isSaving}
          >
            Save Draft
          </Button>
          
          <Button
            variant="primary"
            onClick={handlePublish}
            disabled={!canPublish}
            title={
              !canPublish
                ? 'Complete all requirements: course title, at least 1 lesson, and at least 1 content file'
                : 'Publish course'
            }
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--gray-50)]">
          {/* Tabs Bar */}
          <div className="bg-white px-8 border-b border-[var(--gray-200)] shrink-0">
            <Tabs 
              tabs={TABS} 
              defaultTab="curriculum" 
              onChange={setActiveTab}
            />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              
              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[var(--gray-200)] shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Course Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Description</label>
                        <textarea
                          placeholder="What will students learn in this course?"
                          value={course.description}
                          onChange={(e) =>
                            setCourse({ ...course, description: e.target.value, updatedAt: new Date() })
                          }
                          className="w-full px-4 py-3 rounded-lg border border-[var(--gray-300)] focus:ring-2 focus:ring-[var(--primary-navy)] focus:border-transparent min-h-[150px]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Duration (approx)" placeholder="e.g. 4 weeks" />
                        <Input label="Level" placeholder="e.g. Beginner" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CURRICULUM TAB */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">Course Modules</h3>
                    <Button variant="secondary" size="sm" onClick={() => setShowAddWeekModal(true)}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Week
                    </Button>
                  </div>

                  {course.weeks.map((week) => (
                    <WeekAccordion
                      key={week.id}
                      week={week}
                      onAddLesson={handleAddLesson}
                      onDeleteLesson={handleDeleteLesson}
                      onSelectLesson={(weekId, lessonId) => {
                        setSelectedWeekId(weekId);
                        setSelectedLessonId(lessonId);
                      }}
                      onUploadContent={handleUploadContent}
                      onConfigureAssessment={handleConfigureAssessment}
                      onSelectWeek={(weekId) => {
                        setSelectedWeekId(weekId);
                        setSelectedLessonId(null);
                      }}
                      selectedLessonId={selectedLessonId}
                    />
                  ))}
                  
                  {course.weeks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--gray-300)]">
                      <p className="text-[var(--gray-500)]">No modules yet. Start by adding a week.</p>
                      <Button variant="outline" className="mt-4" onClick={() => setShowAddWeekModal(true)}>
                        Create First Week
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                 <div className="bg-white rounded-xl border border-[var(--gray-200)] shadow-sm p-6">
                   <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Course Settings</h3>
                   <p className="text-[var(--gray-500)]">Configuration options coming soon.</p>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel (Right Side) */}
        {activeTab === 'curriculum' && (
          <div className="w-80 border-l border-[var(--gray-200)] bg-white overflow-y-auto shrink-0 hidden xl:block">
            <PropertiesPanel
              selectedType={selectedLessonId ? 'lesson' : selectedWeekId ? 'week' : null}
              selectedWeek={selectedWeek}
              selectedLesson={selectedLesson}
              onUpdateWeek={handleUpdateWeek}
              onUpdateLesson={handleUpdateLesson}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
          </div>
        )}
      </div>

      <AddWeekModal
        isOpen={showAddWeekModal}
        onClose={() => setShowAddWeekModal(false)}
        onAdd={handleAddWeek}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { WeekAccordion } from '@/components/admin/WeekAccordion';
import { AddWeekModal } from '@/components/admin/AddWeekModal';
import { PropertiesPanel } from '@/components/admin/PropertiesPanel';
import { Course, Week, Lesson, Asset, Question, LessonType, AssessmentConfig } from '@/types/course';
import * as courseService from '@/lib/services/course.service';
import { useAuth } from '@/lib/contexts/auth-context';
import { toast } from 'react-hot-toast';

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseEditPage({ params }: PageProps) {
  const { courseId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [course, setCourse] = useState<Course | null>(null);
  const [initialTitle, setInitialTitle] = useState<string>('');

  // Debounce title and description for auto-save
  const debouncedTitle = useDebounce(course?.title, 1000);
  const debouncedDescription = useDebounce(course?.description, 1000);

  // Load existing course
  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      
      try {
        const result = await courseService.getCourseById(courseId);

        if (result.success && result.data) {
          const dbCourse = result.data;
          
          // Map backend data to frontend types
          const mappedCourse: Course = {
            id: dbCourse.id,
            title: dbCourse.title || '',
            description: dbCourse.description || '',
            status: dbCourse.status === 'published' ? 'Published' : dbCourse.status === 'archived' ? 'Archived' : 'Draft',
            level: (dbCourse.level as any) || 'Beginner',
            language: dbCourse.language || 'English',
            category: dbCourse.category || '',
            weeks: (dbCourse.weeks || [])
              .sort((a, b) => a.order_index - b.order_index)
              .map(week => ({
                id: week.id,
                title: week.title,
                description: week.description || '',
                order: week.order_index,
                isLocked: week.is_locked || false,
                lessons: (week.lessons || [])
                  .sort((a, b) => {
                    // Assessments always go last
                    if (a.type === 'assessment' && b.type !== 'assessment') return 1;
                    if (a.type !== 'assessment' && b.type === 'assessment') return -1;
                    return a.order_index - b.order_index;
                  })
                  .map(lesson => ({
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description || '',
                    type: (lesson.type === 'video' ? 'Video' : lesson.type === 'pdf' ? 'PDF' : 'Assessment') as LessonType,
                    order: lesson.order_index,
                    isPreview: lesson.is_preview || false,
                    duration: lesson.duration_minutes ?? undefined,
                    assets: ((lesson as any).assets || []).map((asset: any) => ({
                      id: asset.id,
                      name: asset.name,
                      type: asset.type as 'video' | 'pdf' | 'image',
                      uploadedAt: new Date(asset.created_at || Date.now()),
                      url: asset.file_path,
                      size: asset.file_size_bytes || 0,
                    })),
                    assessment: lesson.assessment ? {
                      id: lesson.assessment.id,
                      title: lesson.assessment.title,
                      description: lesson.assessment.description || '',
                      type: lesson.assessment.type as 'quiz' | 'exam' | 'practice' || 'quiz',
                      timeLimit: lesson.assessment.time_limit_minutes ?? undefined,
                      maxAttempts: lesson.assessment.max_attempts || 1,
                      passingScore: lesson.assessment.passing_score_percentage || 70,
                      shuffleQuestions: lesson.assessment.shuffle_questions || false,
                      shuffleOptions: lesson.assessment.shuffle_options || false,
                      showResults: (lesson.assessment.show_results as 'immediately' | 'after-submission' | 'after-due-date' | 'never') || 'immediately',
                      showCorrectAnswers: lesson.assessment.show_correct_answers || false,
                      proctoring: {
                        enabled: false,
                        copyPasteAllowed: lesson.assessment.copy_paste_allowed ?? true,
                        rightClickAllowed: lesson.assessment.right_click_allowed ?? true,
                        printAllowed: lesson.assessment.print_allowed ?? true,
                        devToolsAllowed: lesson.assessment.dev_tools_allowed ?? true,
                        tabSwitchingAllowed: lesson.assessment.tab_switch_limit !== 0,
                        tabSwitchLimit: lesson.assessment.tab_switch_limit ?? undefined,
                      },
                      questions: (lesson.assessment.questions || []).map((q: any) => ({
                        id: q.id,
                        title: q.title,
                        description: q.description || '',
                        type: (q.type as 'multiple-choice' | 'true-false' | 'short-answer' | 'essay') || 'multiple-choice',
                        difficulty: (q.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
                        marks: q.marks || 1,
                        duration: q.duration_minutes ?? 0,
                        category: q.category || '',
                        topic: q.topic || '',
                        subtopic: q.subtopic || '',
                        explanation: q.explanation || '',
                        isActive: q.is_active ?? true, // Default to active if not set
                        options: (q.answer_options || []).map((opt: any) => ({
                          id: opt.id,
                          text: opt.text,
                          isCorrect: opt.is_correct || false,
                        })),
                      })),
                      totalMarks: lesson.assessment.total_marks || 0,
                    } : undefined,
                  })),
              })),
            instructors: [],
            tags: dbCourse.tags || [],
            learningObjectives: dbCourse.learning_objectives || [],
            prerequisites: dbCourse.prerequisites || [],
            targetAudience: dbCourse.target_audience || [],
            estimatedDuration: dbCourse.estimated_duration_hours || 0,
            settings: {
              isPublic: true,
              allowSelfEnrollment: true,
              requireApproval: false,
              certificateEnabled: true,
              discussionEnabled: true,
              downloadableResources: true,
            },
            createdAt: new Date(dbCourse.created_at || Date.now()),
            updatedAt: new Date(dbCourse.updated_at || Date.now()),
          };

          setCourse(mappedCourse);
          setInitialTitle(mappedCourse.title);
        } else {
          toast.error('Course not found');
          router.push('/admin/courses');
        }
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Failed to load course');
        router.push('/admin/courses');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, router]);

  // Auto-save Effect for Title/Description
  useEffect(() => {
    if (!course?.id || isLoading || !initialTitle) return;
    // Don't save if title hasn't changed from initial load
    if (debouncedTitle === initialTitle && !debouncedDescription) return;

    const updateDB = async () => {
      setIsSaving(true);
      await courseService.updateCourse(course.id, {
        title: course.title,
        description: course.description,
      });
      setIsSaving(false);
    };

    updateDB();
  }, [debouncedTitle, debouncedDescription, course?.id, isLoading, initialTitle]);

  const handleAddWeek = async (title: string, description: string) => {
    if (!course) return;

    const orderIndex = course.weeks.length;
    const result = await courseService.createWeek({
      course_id: course.id,
      title,
      description,
      order_index: orderIndex,
    });

    if (result.success && result.data) {
      const newWeek: Week = {
        id: result.data.id,
        title: result.data.title,
        description: result.data.description || '',
        lessons: [],
        order: result.data.order_index,
      };

      setCourse(prev => prev ? { ...prev, weeks: [...prev.weeks, newWeek] } : null);
      toast.success('Week added');
    } else {
      toast.error('Failed to add week');
    }
  };

  const handleDeleteWeek = async (weekId: string) => {
    if (!confirm('Delete this week and all its lessons?')) return;
    
    const result = await courseService.deleteWeek(weekId);
    if (result.success) {
      setCourse(prev => prev ? {
        ...prev,
        weeks: prev.weeks.filter(w => w.id !== weekId),
      } : null);
      if (selectedWeekId === weekId) {
        setSelectedWeekId(null);
        setSelectedLessonId(null);
      }
      toast.success('Week deleted');
    } else {
      toast.error('Failed to delete week');
    }
  };

  const handleAddLesson = async (weekId: string, title: string, type: LessonType) => {
    if (!course) return;

    const week = course.weeks.find(w => w.id === weekId);
    if (!week) return;

    const result = await courseService.createLesson({
      week_id: weekId,
      title,
      type: type.toLowerCase() as 'video' | 'pdf' | 'assessment',
      order_index: week.lessons.length,
    });

    if (result.success && result.data) {
      const newLesson: Lesson = {
        id: result.data.id,
        title: result.data.title,
        type: type,
        assets: [],
        order: result.data.order_index,
        description: result.data.description || '',
      };

      // If it's an assessment, create the assessment record
      if (type === 'Assessment') {
        const assessmentResult = await courseService.createAssessment({
          lesson_id: result.data.id,
          title: title,
          type: 'quiz',
          max_attempts: 3,
          passing_score_percentage: 70,
          shuffle_questions: false,
          shuffle_options: false,
          show_results: 'immediately',
          show_correct_answers: true,
        });

        if (assessmentResult.success && assessmentResult.data) {
          newLesson.assessment = {
            id: assessmentResult.data.id,
            title: assessmentResult.data.title,
            type: 'quiz',
            maxAttempts: 3,
            passingScore: 70,
            shuffleQuestions: false,
            shuffleOptions: false,
            showResults: 'immediately',
            showCorrectAnswers: true,
            proctoring: {
              enabled: false,
              copyPasteAllowed: true,
              rightClickAllowed: true,
              printAllowed: true,
              devToolsAllowed: true,
              tabSwitchingAllowed: true,
            },
            questions: [],
            totalMarks: 0,
          };
        } else {
          toast.error(`Lesson created but assessment creation failed: ${assessmentResult.error}`);
        }
      }

      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          weeks: prev.weeks.map(w =>
            w.id === weekId ? { ...w, lessons: [...w.lessons, newLesson] } : w
          ),
        };
      });
      toast.success('Lesson added');
    } else {
      toast.error('Failed to add lesson');
    }
  };

  const handleDeleteLesson = async (weekId: string, lessonId: string) => {
    const result = await courseService.deleteLesson(lessonId);

    if (result.success) {
      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          weeks: prev.weeks.map(w =>
            w.id === weekId ? { ...w, lessons: w.lessons.filter(l => l.id !== lessonId) } : w
          ),
        };
      });
      if (selectedLessonId === lessonId) setSelectedLessonId(null);
      toast.success('Lesson deleted');
    } else {
      toast.error('Failed to delete lesson');
    }
  };

  const handleUploadContent = async (
    weekId: string,
    lessonId: string,
    fileName: string,
    fileType: 'video' | 'pdf',
    file?: File,
    uploadedUrl?: string
  ) => {
    if (!course) {
      console.warn('No course available');
      return;
    }

    // If URL is already provided (from S3 upload), just create the asset record
    if (uploadedUrl) {
      const assetResult = await courseService.createAsset({
        lesson_id: lessonId,
        name: fileName,
        type: fileType,
        file_path: uploadedUrl,
        file_size_bytes: file?.size || 0,
        mime_type: file?.type || (fileType === 'video' ? 'video/mp4' : 'application/pdf'),
      });

      if (assetResult.success && assetResult.data) {
        const newAsset: Asset = {
          id: assetResult.data.id,
          name: assetResult.data.name,
          type: assetResult.data.type as 'video' | 'pdf' | 'image',
          uploadedAt: new Date(assetResult.data.created_at || Date.now()),
          url: uploadedUrl,
          size: assetResult.data.file_size_bytes || 0,
        };

        setCourse(prev => {
          if (!prev) return null;
          return {
            ...prev,
            weeks: prev.weeks.map(w =>
              w.id === weekId
                ? {
                    ...w,
                    lessons: w.lessons.map(l =>
                      l.id === lessonId ? { ...l, assets: [...l.assets, newAsset] } : l
                    ),
                  }
                : w
            ),
          };
        });
        toast.success('File uploaded successfully!');
      } else {
        toast.error('Failed to save asset record');
      }
      return;
    }

    // Fallback: If no URL provided but file exists, upload to Supabase storage
    if (!file) {
      console.warn('No file or URL provided for upload');
      return;
    }

    toast.loading('Uploading file...', { id: 'upload' });

    const bucket = fileType === 'video' ? 'course-videos' : 'course-pdfs';
    const path = `${course.id}/${lessonId}/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const uploadResult = await courseService.uploadFile(bucket, path, file);

    if (uploadResult.success && uploadResult.data) {
      const assetResult = await courseService.createAsset({
        lesson_id: lessonId,
        name: fileName,
        type: fileType,
        file_path: uploadResult.data.path,
        file_size_bytes: file.size,
        mime_type: file.type,
      });

      if (assetResult.success && assetResult.data) {
        const newAsset: Asset = {
          id: assetResult.data.id,
          name: assetResult.data.name,
          type: assetResult.data.type as 'video' | 'pdf' | 'image',
          uploadedAt: new Date(assetResult.data.created_at || Date.now()),
          url: uploadResult.data.url,
          size: assetResult.data.file_size_bytes || 0,
        };

        setCourse(prev => {
          if (!prev) return null;
          return {
            ...prev,
            weeks: prev.weeks.map(w =>
              w.id === weekId
                ? {
                    ...w,
                    lessons: w.lessons.map(l =>
                      l.id === lessonId ? { ...l, assets: [...l.assets, newAsset] } : l
                    ),
                  }
                : w
            ),
          };
        });
        toast.success('File uploaded', { id: 'upload' });
      } else {
        toast.error('File uploaded but asset record failed', { id: 'upload' });
      }
    } else {
      toast.error('Upload failed: ' + (uploadResult.error || 'Unknown error'), { id: 'upload' });
    }
  };

  const handleUpdateWeek = async (weekId: string, updates: Partial<Week>) => {
    setCourse(prev =>
      prev ? { ...prev, weeks: prev.weeks.map(w => (w.id === weekId ? { ...w, ...updates } : w)) } : null
    );

    await courseService.updateWeek(weekId, {
      title: updates.title,
      description: updates.description,
      is_locked: updates.isLocked,
    });
  };

  const handleUpdateLesson = async (lessonId: string, updates: Partial<Lesson>) => {
    setCourse(prev =>
      prev
        ? {
            ...prev,
            weeks: prev.weeks.map(w => ({
              ...w,
              lessons: w.lessons.map(l => (l.id === lessonId ? { ...l, ...updates } : l)),
            })),
          }
        : null
    );

    await courseService.updateLesson(lessonId, {
      title: updates.title,
      description: updates.description,
      type: updates.type ? (updates.type.toLowerCase() as 'video' | 'pdf' | 'assessment') : undefined,
      is_preview: updates.isPreview,
    });
  };

  const handleConfigureAssessment = async (weekId: string, lessonId: string, config: AssessmentConfig) => {
    // Find the lesson and its assessment
    const lesson = course?.weeks.flatMap(w => w.lessons).find(l => l.id === lessonId);
    
    if (!lesson) {
      toast.error('Lesson not found');
      return;
    }

    let result;

    if (lesson.assessment?.id) {
        // Update existing assessment
        result = await courseService.updateAssessment(lesson.assessment.id, {
            title: config.title,
            description: config.description,
            type: config.type as any,
            time_limit_minutes: config.timeLimit,
            max_attempts: config.maxAttempts,
            passing_score_percentage: config.passingScore,
            shuffle_questions: config.shuffleQuestions,
            shuffle_options: config.shuffleOptions,
            show_results: config.showResults as any,
            show_correct_answers: config.showCorrectAnswers,
            copy_paste_allowed: config.proctoring.copyPasteAllowed,
            right_click_allowed: config.proctoring.rightClickAllowed,
            print_allowed: config.proctoring.printAllowed,
            dev_tools_allowed: config.proctoring.devToolsAllowed,
            tab_switch_limit: config.proctoring.tabSwitchLimit ?? null,
        });
    } else {
        // Create new assessment (recover from missing record)
        result = await courseService.createAssessment({
            lesson_id: lessonId,
            title: config.title || lesson.title,
            type: (config.type || 'quiz') as any,
            time_limit_minutes: config.timeLimit,
            max_attempts: config.maxAttempts,
            passing_score_percentage: config.passingScore,
            shuffle_questions: config.shuffleQuestions,
            shuffle_options: config.shuffleOptions,
            show_results: (config.showResults || 'immediately') as any,
            show_correct_answers: config.showCorrectAnswers ?? true,
            copy_paste_allowed: config.proctoring?.copyPasteAllowed ?? true,
            right_click_allowed: config.proctoring?.rightClickAllowed ?? true,
            print_allowed: config.proctoring?.printAllowed ?? true,
            dev_tools_allowed: config.proctoring?.devToolsAllowed ?? true,
            tab_switch_limit: config.proctoring?.tabSwitchLimit ?? null,
        });
    }

    if (result.success && result.data) {
      const updatedData = result.data;
      
      // Update question active status in database
      // Get the IDs of selected questions from config
      const selectedQuestionIds = config.questions.map(q => q.id);
      
      // Update the active status for all questions in this assessment
      if (lesson.assessment?.id) {
        const questionsUpdateResult = await courseService.updateAssessmentQuestions(
          lesson.assessment.id,
          selectedQuestionIds
        );
        
        if (!questionsUpdateResult.success) {
          console.error('[handleConfigureAssessment] Failed to update question status:', questionsUpdateResult.error);
        }
      }
      
      // Get all original questions and mark them with isActive based on selection
      const allQuestions = lesson.assessment?.questions || [];
      const updatedQuestions = allQuestions.map(q => ({
        ...q,
        isActive: selectedQuestionIds.includes(q.id),
      }));
      
      // Update local state
      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          weeks: prev.weeks.map(w => ({
            ...w,
            lessons: w.lessons.map(l =>
              l.id === lessonId ? { 
                  ...l, 
                  assessment: { 
                      ...(l.assessment || {}), 
                      ...config,
                      id: updatedData.id, // Ensure we have the ID for future updates
                      // Keep all questions but with updated isActive status
                      questions: updatedQuestions,
                      totalMarks: config.totalMarks || 0,
                  } as AssessmentConfig
              } : l
            ),
          })),
        };
      });
      toast.success('Assessment saved');
    } else {
      toast.error(`Failed to save assessment: ${result.error}`);
    }
  };

  const handleAddQuestion = async (lessonId: string, question: Question) => {
    const lesson = course?.weeks.flatMap(w => w.lessons).find(l => l.id === lessonId);
    
    if (!lesson?.assessment?.id) {
      toast.error('Assessment record not found. Please click "Configure" on the lesson first to initialize the test.');
      return;
    }

    const result = await courseService.createQuestion(
      lesson.assessment.id,
      {
        title: question.title,
        description: question.description,
        type: question.type.replace('-', '_') as any,
        difficulty: question.difficulty.toLowerCase() as any,
        marks: question.marks,
        duration_minutes: question.duration,
        category: question.category,
        topic: question.topic,
        subtopic: question.subtopic,
        explanation: question.explanation,
        order_index: lesson.assessment.questions.length,
      },
      question.options.map(opt => ({
        text: opt.text,
        is_correct: opt.isCorrect,
      }))
    );

    if (result.success && result.data) {
      const newQuestion: Question = {
        ...question,
        id: result.data.id,
      };

      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          weeks: prev.weeks.map(w => ({
            ...w,
            lessons: w.lessons.map(l =>
              l.id === lessonId && l.assessment
                ? {
                    ...l,
                    assessment: {
                      ...l.assessment,
                      questions: [...l.assessment.questions, newQuestion],
                      totalMarks: l.assessment.totalMarks + question.marks,
                    },
                  }
                : l
            ),
          })),
        };
      });
      toast.success('Question added');
    } else {
      toast.error('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (lessonId: string, questionId: string) => {
    const result = await courseService.deleteQuestion(questionId);

    if (result.success) {
      setCourse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          weeks: prev.weeks.map(w => ({
            ...w,
            lessons: w.lessons.map(l =>
              l.id === lessonId && l.assessment
                ? {
                    ...l,
                    assessment: {
                      ...l.assessment,
                      questions: l.assessment.questions.filter(q => q.id !== questionId),
                      totalMarks: l.assessment.questions
                        .filter(q => q.id !== questionId)
                        .reduce((sum, q) => sum + q.marks, 0),
                    },
                  }
                : l
            ),
          })),
        };
      });
      toast.success('Question deleted');
    } else {
      toast.error('Failed to delete question');
    }
  };

  const handlePublish = async () => {
    if (!course) return;
    setIsSaving(true);
    const result = await courseService.publishCourse(course.id);
    setIsSaving(false);

    if (result.success) {
      setCourse({ ...course, status: 'Published' });
      toast.success('Course published!');
    } else {
      toast.error('Failed to publish');
    }
  };

  const handleUnpublish = async () => {
    if (!course) return;
    setIsSaving(true);
    const result = await courseService.updateCourse(course.id, { status: 'draft' });
    setIsSaving(false);

    if (result.success) {
      setCourse({ ...course, status: 'Draft' });
      toast.success('Course unpublished');
    } else {
      toast.error('Failed to unpublish');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--primary-navy)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--gray-500)]">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-[var(--gray-500)] mb-4">Course not found</p>
          <Link href="/admin/courses">
            <Button variant="primary">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    {
      id: 'curriculum',
      label: 'Curriculum',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: 'details',
      label: 'Course Details',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const canPublish = course.title && course.title !== 'Untitled Course' && course.weeks.length > 0;

  const selectedWeek = selectedWeekId ? course.weeks.find(w => w.id === selectedWeekId) || null : null;

  const selectedLesson = selectedLessonId
    ? course.weeks.flatMap(w => w.lessons).find(l => l.id === selectedLessonId) || null
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky Header */}
      <div className="bg-white border-b border-[var(--gray-200)] px-8 py-5 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/admin/courses" className="text-[var(--gray-500)] hover:text-[var(--gray-700)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 max-w-2xl">
            <Input
              placeholder="Enter course title..."
              value={course.title}
              onChange={e => setCourse({ ...course, title: e.target.value })}
              className="text-xl md:text-2xl font-bold border-0 px-0 focus:ring-0 shadow-none bg-transparent"
            />
          </div>
          <Badge variant={course.status === 'Published' ? 'published' : course.status === 'Archived' ? 'archived' : 'draft'}>
            {course.status}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--gray-500)]">{isSaving ? 'Saving...' : 'Saved'}</span>

          {course.status === 'Published' ? (
            <Button variant="secondary" onClick={handleUnpublish}>
              Unpublish
            </Button>
          ) : (
            <Button variant="primary" onClick={handlePublish} disabled={!canPublish} title={!canPublish ? 'Add title and at least one week to publish' : 'Publish course'}>
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Tabs and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[var(--gray-50)]">
          {/* Tabs Bar */}
          <div className="bg-white px-8 border-b border-[var(--gray-200)] shrink-0">
            <Tabs tabs={TABS} defaultTab="curriculum" onChange={setActiveTab} />
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
                          value={course.description || ''}
                          onChange={e => setCourse({ ...course, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-[var(--gray-300)] focus:ring-2 focus:ring-[var(--primary-navy)] focus:border-transparent min-h-[150px]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Category</label>
                          <Input
                            placeholder="e.g. Film Production"
                            value={course.category || ''}
                            onChange={e => setCourse({ ...course, category: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">Level</label>
                          <select
                            value={course.level}
                            onChange={e => setCourse({ ...course, level: e.target.value as any })}
                            className="w-full px-4 py-3 rounded-lg border border-[var(--gray-300)] focus:ring-2 focus:ring-[var(--primary-navy)] focus:border-transparent"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
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

                  {course.weeks.map(week => (
                    <WeekAccordion
                      key={week.id}
                      week={week}
                      courseId={courseId}
                      onAddLesson={handleAddLesson}
                      onDeleteLesson={handleDeleteLesson}
                      onSelectLesson={(weekId, lessonId) => {
                        setSelectedWeekId(weekId);
                        setSelectedLessonId(lessonId);
                      }}
                      onUploadContent={handleUploadContent}
                      onConfigureAssessment={handleConfigureAssessment}
                      onSelectWeek={weekId => {
                        setSelectedWeekId(weekId);
                        setSelectedLessonId(null);
                      }}
                      selectedLessonId={selectedLessonId}
                    />
                  ))}

                  {course.weeks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[var(--gray-300)]">
                      <svg className="w-12 h-12 mx-auto mb-3 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-[var(--gray-500)] mb-4">No modules yet. Start by adding a week.</p>
                      <Button variant="outline" onClick={() => setShowAddWeekModal(true)}>
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

      <AddWeekModal isOpen={showAddWeekModal} onClose={() => setShowAddWeekModal(false)} onAdd={handleAddWeek} />
    </div>
  );
}

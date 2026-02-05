'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { VideoPlayer } from '@/components/learner/VideoPlayer';
import { PDFViewer } from '@/components/learner/PDFViewer';
import { AssessmentPlayer } from '@/components/learner/AssessmentPlayer';
import * as enrollmentService from '@/lib/services/enrollment.service';
import toast from 'react-hot-toast';

interface Asset {
  id: string;
  name: string;
  type: string;
  file_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  duration_seconds: number | null;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  type: string;
  order_index: number;
  duration_minutes: number | null;
  is_preview: boolean | null;
  completed?: boolean;
  assessment?: {
    id: string;
    title: string;
    type: string;
    time_limit_minutes: number | null;
    passing_score_percentage: number | null;
  } | null;
  assets?: Asset[];
}

interface Week {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
  progress?: number;
}

interface CourseData {
  enrollmentId: string;
  courseId: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  weeks: Week[];
}

const getLessonIcon = (type: string, isSelected: boolean) => {
  const baseClass = isSelected ? 'text-white' : 'text-[var(--gray-500)]';
  const normalizedType = type.toLowerCase();
  
  const iconMap: Record<string, React.ReactNode> = {
    video: (
      <svg className={`w-4 h-4 ${baseClass}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
      </svg>
    ),
    assessment: (
      <svg className={`w-4 h-4 ${baseClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    document: (
      <svg className={`w-4 h-4 ${baseClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    pdf: (
      <svg className={`w-4 h-4 ${baseClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };

  return iconMap[normalizedType] || iconMap.video;
};

const getLessonTypeLabel = (type: string) => {
  const normalizedType = type.toLowerCase();
  const labels: Record<string, { label: string; color: string }> = {
    video: { label: 'Video', color: 'bg-blue-100 text-blue-700' },
    assessment: { label: 'Assessment', color: 'bg-amber-100 text-amber-700' },
    pdf: { label: 'PDF', color: 'bg-red-100 text-red-700' },
    document: { label: 'Document', color: 'bg-purple-100 text-purple-700' },
  };
  return labels[normalizedType] || { label: type, color: 'bg-gray-100 text-gray-700' };
};

export default function CourseViewerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        
        const result = await enrollmentService.getMyEnrollmentByCourse(courseId);
        
        if (!result.success || !result.data) {
          toast.error(result.error || 'Failed to load course');
          router.push('/courses');
          return;
        }

        const enrollment = result.data;
        const course = enrollment.course;
        
        if (!course) {
          toast.error('Course not found');
          router.push('/courses');
          return;
        }

        const progressResult = await enrollmentService.getLearnerProgress(enrollment.id);
        const progressMap: Record<string, boolean> = {};
        
        if (progressResult.success && progressResult.data) {
          progressResult.data.forEach((p: any) => {
            progressMap[p.lesson_id] = p.status === 'completed';
          });
        }
        setLessonProgress(progressMap);

        console.log('[CourseViewer] Raw course data:', JSON.stringify(course, null, 2));
        
        const sortedWeeks = (course.weeks || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((week: any) => ({
            ...week,
            lessons: (week.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index),
          }));
        
        console.log('[CourseViewer] Sorted weeks with lessons:', JSON.stringify(sortedWeeks, null, 2));

        const totalLessons = sortedWeeks.reduce((sum: number, week: any) => 
          sum + (week.lessons?.length || 0), 0);
        const completedLessons = Object.values(progressMap).filter(Boolean).length;

        setCourseData({
          enrollmentId: enrollment.id,
          courseId: course.id,
          title: course.title,
          description: course.description,
          category: course.category,
          level: course.level,
          progress: enrollment.progress_percentage || 0,
          totalLessons,
          completedLessons,
          weeks: sortedWeeks,
        });

        if (sortedWeeks.length > 0) {
          setExpandedWeeks([sortedWeeks[0].id]);
          
          let firstLesson = null;
          for (const week of sortedWeeks) {
            for (const lesson of week.lessons) {
              if (!progressMap[lesson.id]) {
                firstLesson = lesson.id;
                break;
              }
            }
            if (firstLesson) break;
          }
          
          if (!firstLesson && sortedWeeks[0].lessons?.length > 0) {
            firstLesson = sortedWeeks[0].lessons[0].id;
          }
          
          setSelectedLesson(firstLesson);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, router]);

  const findLesson = (lessonId: string | null): Lesson | undefined => {
    if (!lessonId || !courseData) return undefined;
    return courseData.weeks
        .flatMap((w) => w.lessons)
        .find((l) => l.id === lessonId);
  };

  const currentLesson = findLesson(selectedLesson);
  const isLessonCompleted = selectedLesson ? lessonProgress[selectedLesson] : false;

  const toggleWeek = (weekId: string) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekId) ? prev.filter((id) => id !== weekId) : [...prev, weekId]
    );
  };

  const handleMarkComplete = useCallback(async () => {
    if (!selectedLesson || !courseData) return;

    try {
      const result = await enrollmentService.updateLessonProgress(
        courseData.enrollmentId,
        selectedLesson,
        { status: 'completed', progress_percentage: 100 }
      );

      if (result.success) {
        setLessonProgress(prev => ({ ...prev, [selectedLesson]: true }));
        
        const newCompletedCount = Object.values({ ...lessonProgress, [selectedLesson]: true }).filter(Boolean).length;
        const newProgress = Math.round((newCompletedCount / courseData.totalLessons) * 100);
        
        setCourseData(prev => prev ? {
          ...prev,
          progress: newProgress,
          completedLessons: newCompletedCount,
        } : null);

        toast.success('Lesson marked as complete!');
      } else {
        toast.error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error marking complete:', error);
      toast.error('Failed to update progress');
    }
  }, [selectedLesson, courseData, lessonProgress]);

  const navigateLesson = (direction: 'next' | 'prev') => {
    if (!courseData || !selectedLesson) return;
    
    const allLessons = courseData.weeks.flatMap(w => w.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson);
    
    if (direction === 'next' && currentIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedLesson(allLessons[currentIndex - 1].id);
    }
  };

  const getCurrentLessonIndex = () => {
    if (!courseData || !selectedLesson) return { current: 0, total: 0 };
    const allLessons = courseData.weeks.flatMap(w => w.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === selectedLesson);
    return { current: currentIndex + 1, total: allLessons.length };
  };

  const lessonIndex = getCurrentLessonIndex();

  // Helper to get asset URL for a lesson
  const getAssetUrl = (lesson: Lesson, assetType: 'video' | 'pdf'): string | null => {
    console.log('[getAssetUrl] Lesson:', lesson.title, 'Looking for type:', assetType);
    console.log('[getAssetUrl] Lesson assets:', JSON.stringify(lesson.assets, null, 2));
    
    if (!lesson.assets || lesson.assets.length === 0) {
      console.log('[getAssetUrl] No assets found for lesson');
      return null;
    }
    
    // Find the first asset matching the type
    const asset = lesson.assets.find(a => {
      console.log('[getAssetUrl] Checking asset:', a.name, 'type:', a.type, 'vs', assetType);
      return a.type === assetType;
    });
    
    console.log('[getAssetUrl] Found asset:', asset);
    const url = asset?.file_path || null;
    console.log('[getAssetUrl] Returning URL:', url);
    return url;
  };

  // Render content based on lesson type
  const renderLessonContent = () => {
    if (!currentLesson || !courseData) {
      return (
        <div className="flex items-center justify-center h-full bg-[var(--gray-100)]">
          <div className="text-center text-[var(--gray-500)]">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p>Select a lesson to begin</p>
          </div>
        </div>
      );
    }

    const normalizedType = currentLesson.type.toLowerCase();

    // Assessment - only render if assessment data exists
    if (normalizedType === 'assessment') {
      if (!currentLesson.assessment?.id) {
        return (
          <div className="flex items-center justify-center h-full bg-[var(--gray-100)]">
            <div className="text-center text-[var(--gray-500)]">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium mb-2">Assessment Not Available</p>
              <p className="text-sm">This assessment is not configured yet.</p>
            </div>
          </div>
        );
      }
      
      return (
        <AssessmentPlayer
          assessmentId={currentLesson.assessment.id}
          enrollmentId={courseData.enrollmentId}
          lessonTitle={currentLesson.title}
          onComplete={() => {
            handleMarkComplete();
          }}
          onBack={() => navigateLesson('prev')}
        />
      );
    }

    // PDF
    if (normalizedType === 'pdf' || normalizedType === 'document') {
      const pdfUrl = getAssetUrl(currentLesson, 'pdf');
      
      return (
        <PDFViewer
          title={currentLesson.title}
          description={currentLesson.description}
          pdfUrl={pdfUrl}
          onComplete={handleMarkComplete}
          isCompleted={isLessonCompleted}
        />
      );
    }

    // Default: Video
    const videoUrl = getAssetUrl(currentLesson, 'video');
    
    return (
      <VideoPlayer
        title={currentLesson.title}
        description={currentLesson.description}
        videoUrl={videoUrl}
        duration={currentLesson.duration_minutes}
        onComplete={handleMarkComplete}
        isCompleted={isLessonCompleted}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[var(--gray-200)] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[var(--primary-navy)] rounded-full animate-spin"></div>
          </div>
          <span className="text-[var(--gray-500)] text-sm">Loading course...</span>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-[var(--gray-100)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Course not found</h2>
          <p className="text-[var(--gray-500)] mb-6">You may not be enrolled in this course.</p>
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-navy)] text-white font-medium rounded-lg hover:bg-[var(--primary-navy)]/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Courses
          </Link>
        </div>
      </div>
    );
  }

  const typeInfo = currentLesson ? getLessonTypeLabel(currentLesson.type) : null;

  return (
    <div className="min-h-screen bg-[var(--gray-50)] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-[var(--gray-200)] px-4 py-3 flex-shrink-0 z-40">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] hover:text-[var(--foreground)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="h-6 w-px bg-[var(--gray-200)]"></div>
            <div>
              <h1 className="font-semibold text-[var(--foreground)] text-sm">{courseData.title}</h1>
              <p className="text-xs text-[var(--gray-500)]">{courseData.category || 'General'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Progress indicator */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-32 h-1.5 bg-[var(--gray-200)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--primary-navy)] rounded-full transition-all duration-500"
                    style={{ width: `${courseData.progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--primary-navy)]">{courseData.progress}%</span>
              </div>
              <span className="text-xs text-[var(--gray-500)]">
                {courseData.completedLessons}/{courseData.totalLessons} lessons
              </span>
            </div>
            
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-600)] hover:text-[var(--foreground)] transition-colors"
              title="Exit to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Collapsible Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-0' : 'w-72'} bg-white border-r border-[var(--gray-200)] flex-shrink-0 transition-all duration-300 overflow-hidden z-30`}>
          <div className="w-72 h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[var(--gray-200)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-[var(--foreground)] text-sm">Course Content</h2>
                <button 
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1.5 rounded-lg hover:bg-[var(--gray-100)] text-[var(--gray-400)] hover:text-[var(--foreground)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--gray-500)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{courseData.weeks.length} weeks • {courseData.totalLessons} lessons</span>
              </div>
            </div>
            
            {/* Week List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {courseData.weeks.map((week) => {
                const weekLessons = week.lessons || [];
                const completedInWeek = weekLessons.filter(l => lessonProgress[l.id]).length;
                const weekProgress = weekLessons.length > 0 
                  ? Math.round((completedInWeek / weekLessons.length) * 100) 
                  : 0;
                const isExpanded = expandedWeeks.includes(week.id);

                return (
                  <div key={week.id} className="rounded-xl overflow-hidden border border-[var(--gray-200)]">
                    <button
                      onClick={() => toggleWeek(week.id)}
                      className="w-full px-3 py-3 flex items-center justify-between bg-[var(--gray-50)] hover:bg-[var(--gray-100)] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <svg
                          className={`w-4 h-4 text-[var(--gray-400)] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="text-left min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] truncate">{week.title}</p>
                          <p className="text-xs text-[var(--gray-500)]">{weekLessons.length} lessons</p>
                        </div>
                      </div>
                      {weekProgress === 100 ? (
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[var(--gray-500)] flex-shrink-0">{weekProgress}%</span>
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="pb-2 px-2 bg-white">
                        {weekLessons.map((lesson) => {
                          const isCompleted = lessonProgress[lesson.id];
                          const isSelected = selectedLesson === lesson.id;
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson.id)}
                              className={`w-full px-3 py-2.5 flex items-center gap-3 rounded-lg transition-all ${
                                isSelected 
                                  ? 'bg-[var(--primary-navy)] text-white' 
                                  : 'hover:bg-[var(--gray-50)] text-[var(--gray-700)]'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected 
                                  ? 'bg-white/20' 
                                  : isCompleted 
                                    ? 'bg-green-100' 
                                    : 'bg-[var(--gray-100)]'
                              }`}>
                                {isCompleted && !isSelected ? (
                                  <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  getLessonIcon(lesson.type, isSelected)
                                )}
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}>
                                  {lesson.title}
                                </p>
                                <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-[var(--gray-500)]'}`}>
                                  {lesson.type.toLowerCase()}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Sidebar Toggle (when collapsed) */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-[var(--gray-200)] border-l-0 rounded-r-lg p-2 text-[var(--gray-600)] hover:text-[var(--foreground)] hover:bg-[var(--gray-50)] transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderLessonContent()}
          
          {/* Navigation Footer - Only show for non-assessment lessons */}
          {currentLesson && currentLesson.type.toLowerCase() !== 'assessment' && (
            <div className="bg-white border-t border-[var(--gray-200)] px-6 py-4 flex-shrink-0">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <button 
                  onClick={() => navigateLesson('prev')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--gray-200)] hover:bg-[var(--gray-50)] text-[var(--gray-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={lessonIndex.current <= 1}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className="flex items-center gap-4">
                  {typeInfo && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  )}
                  <span className="text-[var(--gray-500)] text-sm">
                    Lesson {lessonIndex.current} of {lessonIndex.total}
                  </span>
                </div>

                <button 
                  onClick={() => navigateLesson('next')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--gray-200)] hover:bg-[var(--gray-50)] text-[var(--gray-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={lessonIndex.current >= lessonIndex.total}
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

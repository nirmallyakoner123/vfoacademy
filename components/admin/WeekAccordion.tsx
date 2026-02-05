'use client';

import React, { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Week, AssessmentConfig } from '@/types/course';
import { LessonRow } from './LessonRow';
import { AddLessonModal } from './AddLessonModal';
import { AssessmentConfigModal } from './AssessmentConfigModal';

interface WeekAccordionProps {
  week: Week;
  courseId?: string;
  onAddLesson: (weekId: string, title: string, type: 'Video' | 'PDF' | 'Assessment') => void;
  onDeleteLesson: (weekId: string, lessonId: string) => void;
  onSelectLesson: (weekId: string, lessonId: string) => void;
  onUploadContent: (weekId: string, lessonId: string, fileName: string, fileType: 'video' | 'pdf', file?: File, url?: string) => void;
  onConfigureAssessment: (weekId: string, lessonId: string, config: AssessmentConfig) => void;
  onSelectWeek: (weekId: string) => void;
  selectedLessonId: string | null;
}

export const WeekAccordion: React.FC<WeekAccordionProps> = ({
  week,
  courseId,
  onAddLesson,
  onDeleteLesson,
  onSelectLesson,
  onUploadContent,
  onConfigureAssessment,
  onSelectWeek,
  selectedLessonId,
}) => {
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedAssessmentLessonId, setSelectedAssessmentLessonId] = useState<string | null>(null);
  
  const handleAddLesson = (title: string, type: 'Video' | 'PDF' | 'Assessment') => {
    onAddLesson(week.id, title, type);
  };

  const handleAddTest = () => {
    onAddLesson(week.id, 'New Assessment', 'Assessment');
  };

  const handleConfigureAssessment = (lessonId: string) => {
    setSelectedAssessmentLessonId(lessonId);
    setShowAssessmentModal(true);
  };

  const handleSaveAssessment = (config: AssessmentConfig) => {
    if (selectedAssessmentLessonId) {
      onConfigureAssessment(week.id, selectedAssessmentLessonId, config);
    }
    setShowAssessmentModal(false);
    setSelectedAssessmentLessonId(null);
  };

  const selectedAssessmentLesson = selectedAssessmentLessonId 
    ? week.lessons.find(l => l.id === selectedAssessmentLessonId)
    : null;
  
  return (
    <>
      <Accordion
        title={week.title}
        defaultOpen={true}
        onToggle={(isOpen) => {
          if (isOpen) {
            onSelectWeek(week.id);
          }
        }}
        headerActions={
          <span className="text-sm text-[var(--gray-500)]">
            {week.lessons.length} lesson{week.lessons.length !== 1 ? 's' : ''}
          </span>
        }
      >
        <div className="space-y-4">
          {week.lessons.length === 0 ? (
            <div className="text-center py-8 text-[var(--gray-500)]">
              <svg className="w-12 h-12 mx-auto mb-3 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="mb-4">No lessons yet</p>
              <div className="flex justify-center gap-3">
                <Button variant="primary" size="sm" onClick={() => setShowAddLessonModal(true)}>
                  Add First Lesson
                </Button>
                <Button variant="secondary" size="sm" onClick={handleAddTest}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Add Final Test
                </Button>
              </div>
            </div>
          ) : (
            <>
              {week.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  courseId={courseId}
                  onDelete={() => onDeleteLesson(week.id, lesson.id)}
                  onSelect={() => onSelectLesson(week.id, lesson.id)}
                  onUpload={(fileName, fileType, file, url) => onUploadContent(week.id, lesson.id, fileName, fileType, file, url)}
                  onConfigureAssessment={() => handleConfigureAssessment(lesson.id)}
                  isSelected={selectedLessonId === lesson.id}
                />
              ))}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowAddLessonModal(true)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Lesson
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={handleAddTest}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Add Final Test
                </Button>
              </div>
            </>
          )}
        </div>
      </Accordion>
      
      <AddLessonModal
        isOpen={showAddLessonModal}
        onClose={() => setShowAddLessonModal(false)}
        onAdd={handleAddLesson}
      />

      <AssessmentConfigModal
        key={`assessment-modal-${selectedAssessmentLessonId || 'none'}-${selectedAssessmentLesson?.assessment?.questions?.length || 0}`}
        isOpen={showAssessmentModal}
        onClose={() => {
          setShowAssessmentModal(false);
          setSelectedAssessmentLessonId(null);
        }}
        onSave={handleSaveAssessment}
        initialConfig={selectedAssessmentLesson?.assessment}
        weekTitle={week.title}
      />
    </>
  );
};

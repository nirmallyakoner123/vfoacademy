'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Lesson, LessonType } from '@/types/course';
import { UploadModal } from './UploadModal';

interface LessonRowProps {
  lesson: Lesson;
  onDelete: () => void;
  onSelect: () => void;
  onUpload: (fileName: string, fileType: 'video' | 'pdf') => void;
  onConfigureAssessment?: () => void;
  isSelected: boolean;
}

const getBadgeVariant = (type: LessonType): 'video' | 'pdf' | 'assessment' => {
  switch (type) {
    case 'Video':
      return 'video';
    case 'PDF':
      return 'pdf';
    case 'Assessment':
      return 'assessment';
    default:
      return 'video';
  }
};

const getContentStatus = (lesson: Lesson): string => {
  if (lesson.type === 'Assessment') {
    if (lesson.assessment) {
      const questionCount = lesson.assessment.questions?.length || 0;
      return questionCount > 0 
        ? `${questionCount} question(s) • ${lesson.assessment.totalMarks} marks`
        : 'Assessment configured • No questions yet';
    }
    return 'Assessment not configured';
  }
  return lesson.assets.length > 0 
    ? `${lesson.assets.length} file(s) attached` 
    : 'No content uploaded';
};

export const LessonRow: React.FC<LessonRowProps> = ({ 
  lesson, 
  onDelete, 
  onSelect,
  onUpload,
  onConfigureAssessment,
  isSelected 
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const isAssessment = lesson.type === 'Assessment';
  
  return (
    <>
      <div
        onClick={onSelect}
        className={`
          flex items-center gap-4 p-5 rounded-xl border transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'border-[var(--primary-navy)] bg-blue-50 shadow-sm' 
            : 'border-[var(--gray-200)] hover:border-[var(--primary-navy-light)] hover:bg-[var(--gray-50)] hover:shadow-sm'
          }
        `}
      >
        {/* Drag Handle */}
        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-[var(--gray-400)] hover:text-[var(--gray-600)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        
        {/* Lesson Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <h4 className="font-semibold text-base text-[var(--foreground)] truncate">{lesson.title}</h4>
            <Badge variant={getBadgeVariant(lesson.type)}>
              {lesson.type}
            </Badge>
          </div>
          <p className="text-sm text-[var(--gray-500)]">
            {getContentStatus(lesson)}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          {isAssessment ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onConfigureAssessment}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploadModal(true)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </Button>
          )}
          
          <button
            onClick={onDelete}
            className="p-2.5 text-[var(--error)] hover:bg-[var(--error-light)] rounded-lg transition-colors"
            title="Delete lesson"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {!isAssessment && (lesson.type === 'Video' || lesson.type === 'PDF') && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={onUpload}
          lessonType={lesson.type}
        />
      )}
    </>
  );
};

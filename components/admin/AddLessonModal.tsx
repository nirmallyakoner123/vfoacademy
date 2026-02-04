'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LessonType } from '@/types/course';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, type: LessonType) => void;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<LessonType>('Video');
  
  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title, type);
      setTitle('');
      setType('Video');
      onClose();
    }
  };
  
  const handleClose = () => {
    setTitle('');
    setType('Video');
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Lesson"
      footer={
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!title.trim()}>
            Add Lesson
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Input
          label="Lesson Title"
          placeholder="e.g., Introduction to Camera Basics"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        
        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
            Lesson Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label 
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                type === 'Video' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-[var(--gray-200)] hover:border-[var(--gray-300)] hover:bg-[var(--gray-50)]'
              }`}
            >
              <input
                type="radio"
                name="lessonType"
                value="Video"
                checked={type === 'Video'}
                onChange={(e) => setType(e.target.value as LessonType)}
                className="sr-only"
              />
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-[var(--foreground)]">Video</span>
            </label>
            
            <label 
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                type === 'PDF' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-[var(--gray-200)] hover:border-[var(--gray-300)] hover:bg-[var(--gray-50)]'
              }`}
            >
              <input
                type="radio"
                name="lessonType"
                value="PDF"
                checked={type === 'PDF'}
                onChange={(e) => setType(e.target.value as LessonType)}
                className="sr-only"
              />
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-[var(--foreground)]">PDF</span>
            </label>

            <label 
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                type === 'Assessment' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-[var(--gray-200)] hover:border-[var(--gray-300)] hover:bg-[var(--gray-50)]'
              }`}
            >
              <input
                type="radio"
                name="lessonType"
                value="Assessment"
                checked={type === 'Assessment'}
                onChange={(e) => setType(e.target.value as LessonType)}
                className="sr-only"
              />
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-sm font-medium text-[var(--foreground)]">Assessment</span>
            </label>
          </div>
          
          {type === 'Assessment' && (
            <p className="mt-3 text-sm text-[var(--gray-500)] bg-purple-50 p-3 rounded-lg">
              After adding, click &quot;Configure&quot; to set up test questions, time limits, and proctoring settings.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

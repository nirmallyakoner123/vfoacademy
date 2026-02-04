import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Week, Lesson, Question } from '@/types/course';
import { AddQuestionModal } from './AddQuestionModal';

interface PropertiesPanelProps {
  selectedType: 'week' | 'lesson' | null;
  selectedWeek: Week | null;
  selectedLesson: Lesson | null;
  onUpdateWeek?: (weekId: string, updates: Partial<Week>) => void;
  onUpdateLesson?: (lessonId: string, updates: Partial<Lesson>) => void;
  onAddQuestion?: (lessonId: string, question: Question) => void;
  onDeleteQuestion?: (lessonId: string, questionId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedType,
  selectedWeek,
  selectedLesson,
  onUpdateWeek,
  onUpdateLesson,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  const handleAddQuestion = (question: Question) => {
    if (selectedLesson && onAddQuestion) {
      onAddQuestion(selectedLesson.id, question);
    }
  };

  if (!selectedType) {
    return (
      <div className="w-80 flex-shrink-0 bg-white border-l border-[var(--gray-200)] p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-center text-[var(--gray-500)]">
          <svg className="w-16 h-16 mb-4 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Select a week or lesson to view properties</p>
        </div>
      </div>
    );
  }
  
  if (selectedType === 'week' && selectedWeek) {
    return (
      <div className="w-80 flex-shrink-0 bg-white border-l border-[var(--gray-200)] p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Week Properties</h3>
          <p className="text-sm text-[var(--gray-500)]">Edit week details</p>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Week Title"
            value={selectedWeek.title}
            onChange={(e) => onUpdateWeek?.(selectedWeek.id, { title: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Week Description
            </label>
            <textarea
              value={selectedWeek.description || ''}
              onChange={(e) => onUpdateWeek?.(selectedWeek.id, { description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--gray-300)] focus:border-[var(--primary-navy)] focus:ring-2 focus:ring-[var(--primary-navy-light)] focus:ring-opacity-20 placeholder:text-[var(--gray-400)] transition-all duration-200"
              rows={4}
              placeholder="Brief description of this week..."
            />
          </div>
          
          <div className="pt-4 border-t border-[var(--gray-200)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--gray-600)]">Total Lessons</span>
              <span className="font-semibold text-[var(--foreground)]">{selectedWeek.lessons.length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (selectedType === 'lesson' && selectedLesson) {
    const isAssessment = selectedLesson.type === 'Assessment';
    
    return (
      <div className="w-80 flex-shrink-0 bg-white border-l border-[var(--gray-200)] p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            {isAssessment ? 'Assessment Properties' : 'Lesson Properties'}
          </h3>
          <p className="text-sm text-[var(--gray-500)]">Edit details</p>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Title"
            value={selectedLesson.title}
            onChange={(e) => onUpdateLesson?.(selectedLesson.id, { title: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Type
            </label>
            <div className="flex items-center gap-2 p-3 bg-[var(--gray-50)] rounded-lg border border-[var(--gray-200)]">
              {selectedLesson.type === 'Video' ? (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ) : selectedLesson.type === 'PDF' ? (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span className="font-medium text-[var(--foreground)]">{selectedLesson.type}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-[var(--gray-200)]">
            <h4 className="text-sm font-medium text-[var(--foreground)] mb-3">
              {isAssessment ? 'Questions' : 'Attachments'}
            </h4>
            
            {isAssessment ? (
              <div className="space-y-3">
                {(!selectedLesson.assessment?.questions || selectedLesson.assessment.questions.length === 0) ? (
                  <p className="text-sm text-[var(--gray-500)]">No questions added yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedLesson.assessment.questions.map((q, index) => (
                      <div key={q.id} className="p-3 bg-white border border-[var(--gray-200)] rounded-lg shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="text-xs font-semibold text-[var(--gray-500)]">Q{index + 1}</span>
                            <p className="text-sm font-medium truncate">{q.title}</p>
                            <div className="flex gap-2 mt-1 text-xs text-[var(--gray-500)]">
                              <span className={`px-1.5 py-0.5 rounded ${
                                q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>{q.difficulty}</span>
                              <span>{q.marks} marks</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => onDeleteQuestion?.(selectedLesson.id, q.id)}
                            className="text-[var(--gray-400)] hover:text-[var(--error)] p-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowAddQuestionModal(true)}
                >
                  + Add Question
                </Button>
              </div>
            ) : (
              /* Existing Render Logic for Video/PDF Assets */
              <>
                {selectedLesson.assets.length === 0 ? (
                  <p className="text-sm text-[var(--gray-500)]">No files attached</p>
                ) : (
                  <div className="space-y-2">
                    {selectedLesson.assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-2 p-2 bg-[var(--gray-50)] rounded border border-[var(--gray-200)]"
                      >
                        {asset.type === 'video' ? (
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                        <span className="text-xs text-[var(--foreground)] truncate flex-1">{asset.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <AddQuestionModal 
          isOpen={showAddQuestionModal}
          onClose={() => setShowAddQuestionModal(false)}
          onSave={handleAddQuestion}
        />
      </div>
    );
  }
  
  return null;
};

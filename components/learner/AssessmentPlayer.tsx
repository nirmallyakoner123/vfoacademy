'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import * as assessmentService from '@/lib/services/assessment.service';
import toast from 'react-hot-toast';

interface AnswerOption {
  id: string;
  text: string;
  order_index: number;
}

interface Question {
  id: string;
  title: string;
  type: string;
  marks: number;
  description: string | null;
  answer_options: AnswerOption[];
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  time_limit_minutes: number | null;
  max_attempts: number | null;
  passing_score_percentage: number | null;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_results: string;
  show_correct_answers: boolean;
  total_marks: number | null;
  questions: Question[];
}

interface AssessmentPlayerProps {
  assessmentId: string;
  enrollmentId: string;
  lessonTitle: string;
  onComplete: () => void;
  onBack: () => void;
}

type ViewState = 'intro' | 'questions' | 'review' | 'results';

export const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({
  assessmentId,
  enrollmentId,
  lessonTitle,
  onComplete,
  onBack,
}) => {
  const [viewState, setViewState] = useState<ViewState>('intro');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [results, setResults] = useState<any>(null);
  const [previousAttempts, setPreviousAttempts] = useState<any[]>([]);

  // Load assessment and check for existing attempts
  useEffect(() => {
    const loadAssessment = async () => {
      setIsLoading(true);
      try {
        // Get assessment details
        const result = await assessmentService.getAssessmentForLearner(assessmentId);
        if (result.success && result.data) {
          setAssessment(result.data as Assessment);
        } else {
          toast.error(result.error || 'Failed to load assessment');
        }

        // Get previous attempts
        const attemptsResult = await assessmentService.getAssessmentAttempts(assessmentId);
        if (attemptsResult.success && attemptsResult.data) {
          setPreviousAttempts(attemptsResult.data);
        }

        // Check for in-progress attempt
        const currentAttempt = await assessmentService.getCurrentAttempt(assessmentId);
        if (currentAttempt.success && currentAttempt.data) {
          setAttemptId(currentAttempt.data.id);
          // Restore answers
          const savedAnswers: Record<string, string> = {};
          currentAttempt.data.attempt_answers?.forEach((a: any) => {
            if (a.selected_option_id) {
              savedAnswers[a.question_id] = a.selected_option_id;
            } else if (a.answer_text) {
              savedAnswers[a.question_id] = a.answer_text;
            }
          });
          setAnswers(savedAnswers);
          
          // If there's an in-progress attempt, go directly to questions
          if (Object.keys(savedAnswers).length > 0) {
            setViewState('questions');
            // Calculate remaining time if timed
            const attemptData = currentAttempt.data as any; // Type assertion to access started_at
            if (attemptData.started_at && result.data?.time_limit_minutes) {
              const startTime = new Date(attemptData.started_at).getTime();
              const elapsed = (Date.now() - startTime) / 1000 / 60;
              const remaining = Math.max(0, result.data.time_limit_minutes - elapsed);
              setTimeRemaining(Math.floor(remaining * 60));
            }
          }
        }
      } catch (error) {
        console.error('Error loading assessment:', error);
        toast.error('Failed to load assessment');
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [assessmentId]);

  // Timer effect
  useEffect(() => {
    if (viewState !== 'questions' || timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewState, timeRemaining]);

  const handleStartAssessment = useCallback(async () => {
    if (!assessment) return;

    // Check max attempts
    if (assessment.max_attempts && previousAttempts.length >= assessment.max_attempts) {
      toast.error('Maximum attempts reached');
      return;
    }

    try {
      const result = await assessmentService.startAssessment(assessmentId, enrollmentId);
      if (result.success && result.data) {
        setAttemptId(result.data.id);
        setViewState('questions');
        setCurrentQuestionIndex(0);
        setAnswers({});
        
        // Set timer if timed
        if (assessment.time_limit_minutes) {
          setTimeRemaining(assessment.time_limit_minutes * 60);
        }
      } else {
        toast.error(result.error || 'Failed to start assessment');
      }
    } catch (error) {
      console.error('Error starting assessment:', error);
      toast.error('Failed to start assessment');
    }
  }, [assessment, previousAttempts, assessmentId, enrollmentId]);


  const handleSelectAnswer = useCallback(async (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    // Save answer to server
    if (attemptId) {
      await assessmentService.submitAnswer(attemptId, questionId, {
        selected_option_id: optionId,
      });
    }
  }, [attemptId]);


  const handleTextAnswer = useCallback(async (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  }, []);

  const saveTextAnswer = useCallback(async (questionId: string) => {
    if (attemptId && answers[questionId]) {
      await assessmentService.submitAnswer(attemptId, questionId, {
        answer_text: answers[questionId],
      });
    }
  }, [attemptId, answers]);


  const handleSubmit = useCallback(async () => {
    if (!attemptId) return;

    setIsSubmitting(true);
    try {
      const result = await assessmentService.submitAssessment(attemptId);
      if (result.success && result.data) {
        setResults(result.data);
        setViewState('results');
        toast.success('Assessment submitted!');
      } else {
        toast.error(result.error || 'Failed to submit assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  }, [attemptId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-[var(--gray-50)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-[var(--gray-200)] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[var(--primary-navy)] rounded-full animate-spin"></div>
          </div>
          <span className="text-[var(--gray-500)] text-sm">Loading assessment...</span>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-full bg-[var(--gray-50)]">
        <div className="text-center">
          <p className="text-[var(--gray-600)]">Assessment not found</p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Intro View
  if (viewState === 'intro') {
    const canAttempt = !assessment.max_attempts || previousAttempts.length < assessment.max_attempts;
    const bestScore = previousAttempts.length > 0 
      ? Math.max(...previousAttempts.map(a => a.percentage || 0))
      : null;

    return (
      <div className="flex items-center justify-center h-full p-6 bg-[var(--gray-50)]">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl p-8 border border-[var(--gray-200)] shadow-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">{assessment.title}</h2>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                {assessment.type === 'quiz' ? 'Quiz' : assessment.type === 'exam' ? 'Exam' : 'Practice'}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[var(--gray-50)] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">{assessment.questions?.length || 0}</div>
                <div className="text-xs text-[var(--gray-500)]">Questions</div>
              </div>
              <div className="bg-[var(--gray-50)] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">{assessment.total_marks || '-'}</div>
                <div className="text-xs text-[var(--gray-500)]">Total Marks</div>
              </div>
              <div className="bg-[var(--gray-50)] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {assessment.time_limit_minutes ? `${assessment.time_limit_minutes}m` : 'No limit'}
                </div>
                <div className="text-xs text-[var(--gray-500)]">Time Limit</div>
              </div>
              <div className="bg-[var(--gray-50)] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">{assessment.passing_score_percentage || 70}%</div>
                <div className="text-xs text-[var(--gray-500)]">Passing Score</div>
              </div>
            </div>

            {/* Previous Attempts */}
            {previousAttempts.length > 0 && (
              <div className="mb-6 p-4 bg-[var(--gray-50)] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--gray-600)]">Previous Attempts</span>
                  <span className="text-sm text-[var(--gray-600)]">
                    {previousAttempts.length}/{assessment.max_attempts || '∞'}
                  </span>
                </div>
                {bestScore !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--gray-600)]">Best Score:</span>
                    <span className={`text-sm font-semibold ${bestScore >= (assessment.passing_score_percentage || 70) ? 'text-green-600' : 'text-red-600'}`}>
                      {bestScore.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {canAttempt ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleStartAssessment}
                >
                  {previousAttempts.length > 0 ? 'Retake Assessment' : 'Start Assessment'}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              ) : (
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-red-600 text-sm">Maximum attempts reached</p>
                </div>
              )}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onBack}
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Questions View
  if (viewState === 'questions') {
    const currentQuestion = assessment.questions?.[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = assessment.questions?.length || 0;

    if (!currentQuestion) {
      return (
        <div className="flex items-center justify-center h-full bg-[var(--gray-50)]">
          <div className="text-center">
            <p className="text-[var(--gray-600)]">No questions available</p>
            <Button variant="outline" onClick={onBack} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-[var(--gray-50)]">
        {/* Header */}
        <div className="bg-white border-b border-[var(--gray-200)] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-[var(--foreground)]">{assessment.title}</h2>
            <span className="text-sm text-[var(--gray-500)]">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-[var(--gray-100)] text-[var(--foreground)]'}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewState('review')}
            >
              Review ({answeredCount}/{totalQuestions})
            </Button>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-1.5 bg-[var(--gray-200)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary-navy)] rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl p-8 border border-[var(--gray-200)] shadow-sm">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-[var(--primary-navy)] text-white rounded-xl flex items-center justify-center font-bold">
                    {currentQuestionIndex + 1}
                  </span>
                  <div>
                    <span className="text-xs text-[var(--gray-500)] uppercase tracking-wider">
                      {currentQuestion.type?.replace('_', ' ') || 'Question'}
                    </span>
                    <div className="text-sm text-[var(--gray-600)]">{currentQuestion.marks} marks</div>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-6">
                {currentQuestion.title}
              </h3>

              {currentQuestion.description && (
                <p className="text-[var(--gray-600)] mb-6">{currentQuestion.description}</p>
              )}

              {/* Answer Options */}
              {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') && currentQuestion.answer_options && (
                <div className="space-y-3">
                  {currentQuestion.answer_options.map((option, index) => {
                    const isSelected = answers[currentQuestion.id] === option.id;
                    const optionLetter = String.fromCharCode(65 + index);
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-[var(--primary-navy)] bg-blue-50'
                            : 'border-[var(--gray-200)] hover:border-[var(--gray-300)] hover:bg-[var(--gray-50)]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                            isSelected
                              ? 'bg-[var(--primary-navy)] text-white'
                              : 'bg-[var(--gray-100)] text-[var(--gray-600)]'
                          }`}>
                            {optionLetter}
                          </span>
                          <span className={`flex-1 ${isSelected ? 'text-[var(--foreground)]' : 'text-[var(--gray-700)]'}`}>
                            {option.text}
                          </span>
                          {isSelected && (
                            <svg className="w-5 h-5 text-[var(--primary-navy)]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text Answer */}
              {(currentQuestion.type === 'short_answer' || currentQuestion.type === 'essay') && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
                  onBlur={() => saveTextAnswer(currentQuestion.id)}
                  placeholder="Type your answer here..."
                  rows={currentQuestion.type === 'essay' ? 8 : 3}
                  className="w-full bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-xl p-4 text-[var(--foreground)] placeholder-[var(--gray-400)] focus:outline-none focus:border-[var(--primary-navy)] resize-none"
                />
              )}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-white border-t border-[var(--gray-200)] px-6 py-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>

            {/* Question Dots */}
            <div className="hidden md:flex items-center gap-1.5">
              {assessment.questions?.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentQuestionIndex
                      ? 'bg-[var(--primary-navy)] scale-125'
                      : answers[q.id]
                        ? 'bg-green-500'
                        : 'bg-[var(--gray-300)] hover:bg-[var(--gray-400)]'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => setViewState('review')}
              >
                Review & Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Review View
  if (viewState === 'review') {
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = (assessment.questions?.length || 0) - answeredCount;

    return (
      <div className="flex flex-col h-full bg-[var(--gray-50)]">
        {/* Header */}
        <div className="bg-white border-b border-[var(--gray-200)] px-6 py-4 flex-shrink-0">
          <h2 className="font-semibold text-[var(--foreground)]">Review Your Answers</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-[var(--gray-200)] shadow-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-[var(--foreground)]">{assessment.questions?.length || 0}</div>
                  <div className="text-sm text-[var(--gray-500)]">Total Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{answeredCount}</div>
                  <div className="text-sm text-[var(--gray-500)]">Answered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-amber-600">{unansweredCount}</div>
                  <div className="text-sm text-[var(--gray-500)]">Unanswered</div>
                </div>
              </div>
            </div>

            {/* Question List */}
            <div className="space-y-2">
              {assessment.questions?.map((question, index) => {
                const isAnswered = !!answers[question.id];
                
                return (
                  <button
                    key={question.id}
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setViewState('questions');
                    }}
                    className="w-full p-4 bg-white hover:bg-[var(--gray-50)] rounded-xl border border-[var(--gray-200)] flex items-center gap-4 transition-colors"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm ${
                      isAnswered ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="flex-1 text-left text-[var(--gray-700)] truncate">
                      {question.title}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isAnswered ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isAnswered ? 'Answered' : 'Not answered'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[var(--gray-200)] px-6 py-4 flex-shrink-0">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setViewState('questions')}
            >
              Back to Questions
            </Button>
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Assessment
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (viewState === 'results') {
    const passed = results?.passed;
    const percentage = results?.percentage || 0;

    return (
      <div className="flex items-center justify-center h-full p-6 bg-[var(--gray-50)]">
        <div className="max-w-lg w-full text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          <p className="text-[var(--gray-600)] mb-8">
            {passed 
              ? 'You have successfully passed this assessment.' 
              : `You need ${assessment.passing_score_percentage}% to pass.`}
          </p>

          <div className="bg-white rounded-2xl p-6 mb-8 border border-[var(--gray-200)] shadow-sm">
            <div className="text-5xl font-bold text-[var(--foreground)] mb-2">{percentage.toFixed(1)}%</div>
            <div className="text-[var(--gray-500)]">Your Score</div>
            <div className="mt-4 text-sm text-[var(--gray-600)]">
              {results?.score || 0} / {results?.max_score || assessment.total_marks} marks
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                onComplete();
              }}
            >
              Continue Learning
            </Button>
            {!passed && assessment.max_attempts && previousAttempts.length < assessment.max_attempts && (
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  setViewState('intro');
                  setResults(null);
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

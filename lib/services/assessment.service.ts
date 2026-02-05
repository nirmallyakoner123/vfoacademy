import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type AssessmentAttempt = Database['public']['Tables']['assessment_attempts']['Row'];
type AttemptAnswer = Database['public']['Tables']['attempt_answers']['Row'];

/**
 * Start a new assessment attempt
 */
export async function startAssessment(
    assessmentId: string,
    enrollmentId: string
): Promise<{ success: boolean; data?: AssessmentAttempt; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Check max attempts
        const { data: assessment } = await supabase
            .from('assessments')
            .select('max_attempts, total_marks')
            .eq('id', assessmentId)
            .single();

        if (!assessment) {
            return { success: false, error: 'Assessment not found' };
        }

        // Check if there's already an in-progress attempt
        const { data: existingAttempt } = await supabase
            .from('assessment_attempts')
            .select('*')
            .eq('assessment_id', assessmentId)
            .eq('learner_id', user.id)
            .eq('status', 'in_progress')
            .single();

        if (existingAttempt) {
            return { success: true, data: existingAttempt };
        }

        // Count existing attempts
        const { data: attempts } = await supabase
            .from('assessment_attempts')
            .select('attempt_number')
            .eq('assessment_id', assessmentId)
            .eq('learner_id', user.id)
            .order('attempt_number', { ascending: false })
            .limit(1);

        const nextAttemptNumber = (attempts?.[0]?.attempt_number || 0) + 1;

        if (assessment.max_attempts && nextAttemptNumber > assessment.max_attempts) {
            return { success: false, error: 'Maximum attempts reached' };
        }

        // Create new attempt
        const { data, error } = await supabase
            .from('assessment_attempts')
            .insert({
                assessment_id: assessmentId,
                learner_id: user.id,
                enrollment_id: enrollmentId,
                attempt_number: nextAttemptNumber,
                status: 'in_progress',
                max_score: assessment.total_marks,
            })
            .select()
            .single();

        if (error) {
            // Handle race condition for duplicate attempt number
            if (error.code === '23505') {
                return { success: false, error: 'An attempt is already initializing. Please try again.' };
            }
            throw error;
        }

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Submit answer for a question
 */
export async function submitAnswer(
    attemptId: string,
    questionId: string,
    answer: {
        answer_text?: string;
        selected_option_id?: string;
    }
): Promise<{ success: boolean; data?: AttemptAnswer; error?: string }> {
    try {
        // Check if answer already exists
        const { data: existing } = await supabase
            .from('attempt_answers')
            .select('id')
            .eq('attempt_id', attemptId)
            .eq('question_id', questionId)
            .maybeSingle();

        let result;

        if (existing) {
            // Update existing answer
            result = await supabase
                .from('attempt_answers')
                .update({
                    ...answer,
                    answered_at: new Date().toISOString(),
                })
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Create new answer
            result = await supabase
                .from('attempt_answers')
                .insert({
                    attempt_id: attemptId,
                    question_id: questionId,
                    ...answer,
                })
                .select()
                .single();
        }

        if (result.error) throw result.error;

        return { success: true, data: result.data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Submit assessment attempt
 */
export async function submitAssessment(
    attemptId: string
): Promise<{ success: boolean; data?: AssessmentAttempt; error?: string }> {
    try {
        // Auto-grade MCQ and True/False questions
        await autoGradeAttempt(attemptId);

        // Update attempt status
        const { data, error } = await supabase
            .from('assessment_attempts')
            .update({
                status: 'submitted',
                submitted_at: new Date().toISOString(),
            })
            .eq('id', attemptId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Auto-grade multiple choice and true/false questions
 */
async function autoGradeAttempt(attemptId: string) {
    try {
        // Get all answers for this attempt
        const { data: answers } = await supabase
            .from('attempt_answers')
            .select(`
        id,
        question_id,
        selected_option_id,
        questions (
          id,
          type,
          marks
        ),
        answer_options (
          is_correct
        )
      `)
            .eq('attempt_id', attemptId);

        if (!answers) return;

        let totalScore = 0;

        // Grade each answer
        for (const answer of answers) {
            const question = answer.questions;
            const option = answer.answer_options;

            // Only auto-grade MCQ and True/False
            if (question && (question.type === 'multiple_choice' || question.type === 'true_false')) {
                const isCorrect = option?.is_correct || false;
                const marksAwarded = isCorrect ? question.marks : 0;

                // Update answer with grade
                await supabase
                    .from('attempt_answers')
                    .update({
                        is_correct: isCorrect,
                        marks_awarded: marksAwarded,
                    })
                    .eq('id', answer.id);

                totalScore += marksAwarded;
            }
        }

        // Get max score and calculate percentage
        const { data: attempt } = await supabase
            .from('assessment_attempts')
            .select('max_score, assessment_id')
            .eq('id', attemptId)
            .single();

        if (!attempt || !attempt.max_score) return;

        const percentage = (totalScore / attempt.max_score) * 100;

        // Get passing score
        const { data: assessment } = await supabase
            .from('assessments')
            .select('passing_score_percentage')
            .eq('id', attempt.assessment_id || '')
            .single();

        const passed = percentage >= (assessment?.passing_score_percentage || 70);

        // Update attempt with score
        await supabase
            .from('assessment_attempts')
            .update({
                score: totalScore,
                percentage: percentage,
                passed: passed,
                graded_at: new Date().toISOString(),
                status: 'graded',
            })
            .eq('id', attemptId);

    } catch (error) {
        console.error('Error auto-grading attempt:', error);
    }
}

/**
 * Manual grading for essay/short answer questions
 */
export async function gradeAnswer(
    answerId: string,
    marksAwarded: number,
    feedback?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Update answer
        const { error: answerError } = await supabase
            .from('attempt_answers')
            .update({
                marks_awarded: marksAwarded,
                feedback: feedback,
            })
            .eq('id', answerId);

        if (answerError) throw answerError;

        // Recalculate attempt score
        const { data: answer } = await supabase
            .from('attempt_answers')
            .select('attempt_id')
            .eq('id', answerId)
            .single();

        if (answer && answer.attempt_id) {
            await recalculateAttemptScore(answer.attempt_id, user.id);
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Recalculate total score for an attempt
 */
async function recalculateAttemptScore(attemptId: string, gradedBy: string) {
    try {
        // Sum all marks awarded
        const { data: answers } = await supabase
            .from('attempt_answers')
            .select('marks_awarded')
            .eq('attempt_id', attemptId);

        const totalScore = answers?.reduce((sum, a) => sum + (a.marks_awarded || 0), 0) || 0;

        // Get max score
        const { data: attempt } = await supabase
            .from('assessment_attempts')
            .select('max_score, assessment_id')
            .eq('id', attemptId)
            .single();

        if (!attempt || !attempt.max_score) return;

        const percentage = (totalScore / attempt.max_score) * 100;

        // Get passing score
        const { data: assessment } = await supabase
            .from('assessments')
            .select('passing_score_percentage')
            .eq('id', attempt.assessment_id || '')
            .single();

        const passed = percentage >= (assessment?.passing_score_percentage || 70);

        // Update attempt
        await supabase
            .from('assessment_attempts')
            .update({
                score: totalScore,
                percentage: percentage,
                passed: passed,
                status: 'graded',
                graded_at: new Date().toISOString(),
                graded_by: gradedBy,
            })
            .eq('id', attemptId);

    } catch (error) {
        console.error('Error recalculating score:', error);
    }
}

/**
 * Get learner's attempts for an assessment
 */
export async function getAssessmentAttempts(assessmentId: string, learnerId?: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const userId = learnerId || user.id;

        const { data, error } = await supabase
            .from('assessment_attempts')
            .select(`
        *,
        assessment:assessments (
          title,
          max_attempts,
          passing_score_percentage
        )
      `)
            .eq('assessment_id', assessmentId)
            .eq('learner_id', userId)
            .order('attempt_number', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get attempt details with answers
 */
export async function getAttemptDetails(attemptId: string) {
    try {
        const { data, error } = await supabase
            .from('assessment_attempts')
            .select(`
        *,
        assessment:assessments (
          *,
          lesson:lessons (
            title,
            week:weeks (
              title,
              course:courses (
                title
              )
            )
          )
        ),
        attempt_answers (
          *,
          question:questions (
            *,
            answer_options (*)
          )
        )
      `)
            .eq('id', attemptId)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get assessment with questions for taking the test
 * Note: This returns questions without correct answer info for security
 */
export async function getAssessmentForLearner(assessmentId: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get assessment with questions
        const { data, error } = await supabase
            .from('assessments')
            .select(`
                id,
                title,
                type,
                time_limit_minutes,
                max_attempts,
                passing_score_percentage,
                shuffle_questions,
                shuffle_options,
                show_results,
                show_correct_answers,
                total_marks,
                lesson_id,
                questions (
                    id,
                    title,
                    type,
                    marks,
                    description,
                    is_active,
                    answer_options (
                        id,
                        text,
                        order_index
                    )
                )
            `)
            .eq('id', assessmentId)
            .single();

        if (error) throw error;

        // Filter only active questions and shuffle if needed
        let questions = (data.questions || []).filter((q: any) => q.is_active !== false);

        if (data.shuffle_questions) {
            questions = questions.sort(() => Math.random() - 0.5);
        }

        // Shuffle options if needed
        if (data.shuffle_options) {
            questions = questions.map((q: any) => ({
                ...q,
                answer_options: (q.answer_options || []).sort(() => Math.random() - 0.5)
            }));
        }

        return {
            success: true,
            data: {
                ...data,
                questions
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get current in-progress attempt for an assessment
 */
export async function getCurrentAttempt(assessmentId: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data, error } = await supabase
            .from('assessment_attempts')
            .select(`
                id,
                created_at,
                assessment_id,
                learner_id,
                attempt_answers (
                    question_id,
                    selected_option_id,
                    answer_text
                )
            `)
            .eq('assessment_id', assessmentId)
            .eq('learner_id', user.id)
            .eq('status', 'in_progress')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Track proctoring violations
 */
export async function recordViolation(
    attemptId: string,
    violationType: string,
    details?: any
) {
    try {
        // Get current violations
        const { data: attempt } = await supabase
            .from('assessment_attempts')
            .select('violations, tab_switches')
            .eq('id', attemptId)
            .single();

        if (!attempt) return { success: false, error: 'Attempt not found' };

        const violations = Array.isArray(attempt.violations) ? attempt.violations : [];
        violations.push({
            type: violationType,
            timestamp: new Date().toISOString(),
            details,
        });

        const updates: any = { violations };

        // Increment tab switches if applicable
        if (violationType === 'tab_switch') {
            updates.tab_switches = (attempt.tab_switches || 0) + 1;
        }

        const { error } = await supabase
            .from('assessment_attempts')
            .update(updates)
            .eq('id', attemptId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

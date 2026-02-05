import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type Enrollment = Database['public']['Tables']['enrollments']['Row'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];

export interface EnrollmentWithDetails extends Enrollment {
    course?: {
        id: string;
        title: string;
        thumbnail_url: string | null;
        status: string;
        category: string | null;
    };
    learner?: {
        id: string;
        full_name: string | null;
        email: string | null;
        employee_id: string | null;
        department: string | null;
    };
}

/**
 * Enroll learner in a course
 */
export async function enrollLearner(courseId: string, learnerId: string) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Check if already enrolled
        const { data: existing } = await supabase
            .from('enrollments')
            .select('id')
            .eq('course_id', courseId)
            .eq('learner_id', learnerId)
            .single();

        if (existing) {
            return { success: false, error: 'Learner is already enrolled in this course' };
        }

        const { data, error } = await supabase
            .from('enrollments')
            .insert({
                course_id: courseId,
                learner_id: learnerId,
                enrolled_by: user.id,
                status: 'active',
            })
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Bulk enroll multiple learners in a course
 */
export async function bulkEnrollLearners(courseId: string, learnerIds: string[]) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get existing enrollments
        const { data: existingEnrollments } = await supabase
            .from('enrollments')
            .select('learner_id')
            .eq('course_id', courseId)
            .in('learner_id', learnerIds);

        const existingLearnerIds = new Set(existingEnrollments?.map(e => e.learner_id) || []);
        const newLearnerIds = learnerIds.filter(id => !existingLearnerIds.has(id));

        if (newLearnerIds.length === 0) {
            return { success: true, data: [], message: 'All learners are already enrolled' };
        }

        const enrollments = newLearnerIds.map(learnerId => ({
            course_id: courseId,
            learner_id: learnerId,
            enrolled_by: user.id,
            status: 'active' as const,
        }));

        const { data, error } = await supabase
            .from('enrollments')
            .insert(enrollments)
            .select();

        if (error) throw error;

        return {
            success: true,
            data,
            message: `Successfully enrolled ${newLearnerIds.length} learner(s). ${existingLearnerIds.size} were already enrolled.`
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get all enrollments with course and learner details (for admin)
 */
export async function getAllEnrollments() {
    try {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                course:courses (
                    id,
                    title,
                    thumbnail_url,
                    status,
                    category
                ),
                learner:profiles!enrollments_learner_id_fkey (
                    id,
                    full_name,
                    email,
                    employee_id,
                    department
                )
            `)
            .order('enrolled_at', { ascending: false });

        if (error) throw error;

        return { success: true, data: data as EnrollmentWithDetails[] };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update enrollment status
 */
export async function updateEnrollmentStatus(
    enrollmentId: string,
    status: 'active' | 'completed' | 'dropped' | 'suspended'
) {
    try {
        const updateData: any = { status };

        if (status === 'completed') {
            updateData.completed_at = new Date().toISOString();
            updateData.progress_percentage = 100;
        }

        const { data, error } = await supabase
            .from('enrollments')
            .update(updateData)
            .eq('id', enrollmentId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete/Unenroll a learner from a course
 */
export async function unenrollLearner(enrollmentId: string) {
    try {
        // First delete lesson progress
        await supabase
            .from('lesson_progress')
            .delete()
            .eq('enrollment_id', enrollmentId);

        // Then delete the enrollment
        const { error } = await supabase
            .from('enrollments')
            .delete()
            .eq('id', enrollmentId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get all learners (for enrollment selection)
 */
export async function getAllLearners() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, employee_id, department, role')
            .eq('role', 'learner')
            .eq('is_active', true)
            .order('full_name', { ascending: true });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get all published courses (for enrollment selection)
 */
export async function getPublishedCourses() {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('id, title, thumbnail_url, category, status')
            .eq('status', 'published')
            .order('title', { ascending: true });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get learner's enrollments
 */
export async function getLearnerEnrollments(learnerId: string) {
    try {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
        *,
        course:courses (*)
      `)
            .eq('learner_id', learnerId)
            .order('enrolled_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get course enrollments (for admins)
 */
export async function getCourseEnrollments(courseId: string) {
    try {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
        *,
        learner:profiles!enrollments_learner_id_fkey (
          id,
          full_name,
          email,
          employee_id,
          department
        )
      `)
            .eq('course_id', courseId)
            .order('enrolled_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update lesson progress
 */
export async function updateLessonProgress(
    enrollmentId: string,
    lessonId: string,
    progress: {
        status?: 'not_started' | 'in_progress' | 'completed';
        progress_percentage?: number;
        time_spent_seconds?: number;
        last_position_seconds?: number;
    }
) {
    try {
        // Check if progress record exists
        const { data: existing } = await supabase
            .from('lesson_progress')
            .select('id')
            .eq('enrollment_id', enrollmentId)
            .eq('lesson_id', lessonId)
            .maybeSingle();

        let result;

        if (existing) {
            // Update existing progress
            result = await supabase
                .from('lesson_progress')
                .update({
                    ...progress,
                    ...(progress.status === 'in_progress' && !existing ? { started_at: new Date().toISOString() } : {}),
                    ...(progress.status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
                })
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Create new progress record
            result = await supabase
                .from('lesson_progress')
                .insert({
                    enrollment_id: enrollmentId,
                    lesson_id: lessonId,
                    ...progress,
                    started_at: new Date().toISOString(),
                    ...(progress.status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
                })
                .select()
                .single();
        }

        if (result.error) throw result.error;

        // Update enrollment progress percentage
        await updateEnrollmentProgress(enrollmentId);

        return { success: true, data: result.data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Calculate and update enrollment progress
 */
async function updateEnrollmentProgress(enrollmentId: string) {
    try {
        // Get enrollment with course lessons
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select(`
        id,
        course_id,
        courses!inner (
          weeks!inner (
            lessons (id)
          )
        )
      `)
            .eq('id', enrollmentId)
            .single();

        if (!enrollment) return;

        // Count total lessons
        const totalLessons = enrollment.courses.weeks.reduce(
            (sum: number, week: any) => sum + (week.lessons?.length || 0),
            0
        );

        if (totalLessons === 0) return;

        // Count completed lessons
        const { data: completedLessons } = await supabase
            .from('lesson_progress')
            .select('id')
            .eq('enrollment_id', enrollmentId)
            .eq('status', 'completed');

        const completedCount = completedLessons?.length || 0;
        const progressPercentage = Math.round((completedCount / totalLessons) * 100);

        // Update enrollment
        await supabase
            .from('enrollments')
            .update({
                progress_percentage: progressPercentage,
                last_accessed_at: new Date().toISOString(),
                ...(progressPercentage === 100 ? {
                    status: 'completed',
                    completed_at: new Date().toISOString()
                } : {}),
            })
            .eq('id', enrollmentId);

    } catch (error) {
        console.error('Error updating enrollment progress:', error);
    }
}

/**
 * Get learner's progress for a course
 */
export async function getLearnerProgress(enrollmentId: string) {
    try {
        const { data, error } = await supabase
            .from('lesson_progress')
            .select(`
        *,
        lesson:lessons (
          id,
          title,
          type,
          week:weeks (
            id,
            title
          )
        )
      `)
            .eq('enrollment_id', enrollmentId)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get current learner's enrollments with full course details (for learner portal)
 */
export async function getMyEnrollments() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                course:courses (
                    id,
                    title,
                    description,
                    thumbnail_url,
                    category,
                    level,
                    language,
                    status,
                    estimated_duration_hours,
                    weeks (
                        id,
                        title,
                        order_index,
                        lessons (
                            id,
                            title,
                            type,
                            order_index,
                            duration_minutes
                        )
                    )
                )
            `)
            .eq('learner_id', user.id)
            .in('status', ['active', 'completed'])
            .order('last_accessed_at', { ascending: false, nullsFirst: false });

        if (error) throw error;

        // Calculate lesson counts for each enrollment
        const enrichedData = data?.map(enrollment => {
            const weeks = enrollment.course?.weeks || [];
            const totalLessons = weeks.reduce((sum: number, week: any) =>
                sum + (week.lessons?.length || 0), 0
            );
            const completedLessons = Math.round((enrollment.progress_percentage || 0) * totalLessons / 100);

            return {
                ...enrollment,
                totalLessons,
                completedLessons,
            };
        });

        return { success: true, data: enrichedData };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get learner stats for dashboard
 */
export async function getLearnerStats() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Get all enrollments
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('id, status, progress_percentage')
            .eq('learner_id', user.id);

        if (enrollError) throw enrollError;

        // Get certificates count
        const { count: certificatesCount, error: certError } = await supabase
            .from('certificates')
            .select('id', { count: 'exact', head: true })
            .in('enrollment_id', enrollments?.map(e => e.id) || []);

        if (certError) throw certError;

        // Calculate stats
        const stats = {
            coursesEnrolled: enrollments?.length || 0,
            coursesCompleted: enrollments?.filter(e => e.status === 'completed').length || 0,
            coursesInProgress: enrollments?.filter(e => e.status === 'active').length || 0,
            certificates: certificatesCount || 0,
            averageProgress: enrollments?.length
                ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length)
                : 0,
        };

        return { success: true, data: stats };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get enrollment by course ID for current learner
 */
export async function getMyEnrollmentByCourse(courseId: string) {
    console.log('[getMyEnrollmentByCourse] Called with courseId:', courseId);

    try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[getMyEnrollmentByCourse] Current user:', user?.id);

        if (!user) {
            console.error('[getMyEnrollmentByCourse] No authenticated user');
            return { success: false, error: 'Not authenticated' };
        }

        console.log('[getMyEnrollmentByCourse] Fetching enrollment for learner:', user.id, 'course:', courseId);

        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                course:courses (
                    id,
                    title,
                    description,
                    thumbnail_url,
                    category,
                    level,
                    language,
                    weeks (
                        id,
                        title,
                        description,
                        order_index,
                        lessons (
                            id,
                            title,
                            description,
                            type,
                            order_index,
                            duration_minutes,
                            is_preview,
                            assessment:assessments (
                                id,
                                title,
                                type,
                                time_limit_minutes,
                                passing_score_percentage
                            ),
                            assets (
                                id,
                                name,
                                type,
                                file_path,
                                file_size_bytes,
                                mime_type,
                                duration_seconds
                            )
                        )
                    )
                )
            `)
            .eq('learner_id', user.id)
            .eq('course_id', courseId)
            .single();

        console.log('[getMyEnrollmentByCourse] Supabase response - error:', error);
        console.log('[getMyEnrollmentByCourse] Supabase response - data:', JSON.stringify(data, null, 2));
        
        // Log assets specifically
        if (data?.course?.weeks) {
            data.course.weeks.forEach((week: any) => {
                console.log('[getMyEnrollmentByCourse] Week:', week.title);
                week.lessons?.forEach((lesson: any) => {
                    console.log('[getMyEnrollmentByCourse] Lesson:', lesson.title, 'Type:', lesson.type, 'Assets:', JSON.stringify(lesson.assets));
                });
            });
        }

        if (error) {
            console.error('[getMyEnrollmentByCourse] Supabase error:', error);
            if (error.code === 'PGRST116') {
                return { success: false, error: 'You are not enrolled in this course' };
            }
            throw error;
        }

        console.log('[getMyEnrollmentByCourse] Success, returning data');
        return { success: true, data };
    } catch (error: any) {
        console.error('[getMyEnrollmentByCourse] Caught error:', error);
        return { success: false, error: error.message };
    }
}

import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];
type CourseUpdate = Database['public']['Tables']['courses']['Update'];
type Week = Database['public']['Tables']['weeks']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Assessment = Database['public']['Tables']['assessments']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];

export interface CourseWithDetails extends Course {
    weeks?: (Week & {
        lessons?: (Lesson & {
            assessment?: Assessment & {
                questions?: Question[];
            };
        })[];
    })[];
}

/**
 * Course with counts for list view
 */
export interface CourseWithCounts extends Course {
    weeks_count: number;
    lessons_count: number;
    enrollments_count: number;
}

/**
 * Get all courses (with filters)
 */
export async function getCourses(filters?: {
    status?: string;
    category?: string;
    search?: string;
}) {
    try {
        let query = supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status as Database['public']['Enums']['course_status']);
        }

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get all courses with week/lesson/enrollment counts for list view
 */
export async function getCoursesWithCounts(filters?: {
    status?: string;
    category?: string;
    search?: string;
}): Promise<{ success: boolean; data?: CourseWithCounts[]; error?: string }> {
    try {
        // Get courses with nested counts
        let query = supabase
            .from('courses')
            .select(`
                *,
                weeks (
                    id,
                    lessons (id)
                ),
                enrollments (id)
            `)
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status as Database['public']['Enums']['course_status']);
        }

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to include counts
        const coursesWithCounts: CourseWithCounts[] = (data || []).map((course: any) => {
            const weeks = course.weeks || [];
            const lessonsCount = weeks.reduce((total: number, week: any) => {
                return total + (week.lessons?.length || 0);
            }, 0);

            return {
                ...course,
                weeks_count: weeks.length,
                lessons_count: lessonsCount,
                enrollments_count: course.enrollments?.length || 0,
                // Remove nested data from response
                weeks: undefined,
                enrollments: undefined,
            };
        });

        return { success: true, data: coursesWithCounts };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get single course with full details
 */
export async function getCourseById(courseId: string): Promise<{
    success: boolean;
    data?: CourseWithDetails;
    error?: string;
}> {
    console.log('[getCourseById] Fetching course:', courseId);
    try {
        const { data, error } = await supabase
            .from('courses')
            .select(`
        *,
        weeks (
          *,
          lessons (
            *,
            assessment:assessments (
              *,
              questions (
                *,
                answer_options (*)
              )
            ),
            assets (
              id,
              name,
              type,
              file_path,
              file_size_bytes,
              mime_type,
              duration_seconds,
              created_at
            )
          )
        )
      `)
            .eq('id', courseId)
            .single();

        console.log('[getCourseById] Supabase response - error:', error);
        
        // Log assets specifically
        if (data?.weeks) {
            data.weeks.forEach((week: any) => {
                console.log('[getCourseById] Week:', week.title);
                week.lessons?.forEach((lesson: any) => {
                    console.log('[getCourseById] Lesson:', lesson.title, 'Type:', lesson.type, 'Assets:', JSON.stringify(lesson.assets));
                });
            });
        }

        if (error) throw error;

        return { success: true, data: data as CourseWithDetails };
    } catch (error: any) {
        console.error('[getCourseById] Error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Create new course
 */
export async function createCourse(courseData: CourseInsert) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data, error } = await supabase
            .from('courses')
            .insert({
                ...courseData,
                created_by: user.id,
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
 * Update course
 */
export async function updateCourse(courseId: string, updates: CourseUpdate) {
    try {
        const { data, error } = await supabase
            .from('courses')
            .update(updates)
            .eq('id', courseId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete course
 */
export async function deleteCourse(courseId: string) {
    try {
        const { data, error } = await supabase
            .from('courses')
            .delete()
            .eq('id', courseId)
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('Course not found or permission denied');

        return { success: true };
    } catch (error: any) {
        // Handle "Row not found" error from .single() which means 0 rows deleted
        if (error.code === 'PGRST116') {
            return { success: false, error: 'Course not found or permission denied' };
        }
        return { success: false, error: error.message };
    }
}

/**
 * Publish course
 */
export async function publishCourse(courseId: string) {
    try {
        const { data, error } = await supabase
            .from('courses')
            .update({
                status: 'published',
                published_at: new Date().toISOString(),
            })
            .eq('id', courseId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Create week
 */
export async function createWeek(weekData: {
    course_id: string;
    title: string;
    description?: string;
    order_index: number;
}) {
    try {
        const { data, error } = await supabase
            .from('weeks')
            .insert(weekData)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update week
 */
export async function updateWeek(weekId: string, updates: Partial<Week>) {
    try {
        const { data, error } = await supabase
            .from('weeks')
            .update(updates)
            .eq('id', weekId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete week
 */
export async function deleteWeek(weekId: string) {
    try {
        const { error } = await supabase
            .from('weeks')
            .delete()
            .eq('id', weekId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Create lesson
 */
export async function createLesson(lessonData: {
    week_id: string;
    title: string;
    description?: string;
    type: 'video' | 'pdf' | 'assessment';
    order_index: number;
    duration_minutes?: number;
}) {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .insert(lessonData)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update lesson
 */
export async function updateLesson(lessonId: string, updates: Partial<Lesson>) {
    try {
        const { data, error } = await supabase
            .from('lessons')
            .update(updates)
            .eq('id', lessonId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete lesson
 */
export async function deleteLesson(lessonId: string) {
    try {
        const { error } = await supabase
            .from('lessons')
            .delete()
            .eq('id', lessonId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Create assessment
 */
export async function createAssessment(assessmentData: Database['public']['Tables']['assessments']['Insert']) {
    try {
        const { data, error } = await supabase
            .from('assessments')
            .insert(assessmentData)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update assessment
 */
export async function updateAssessment(assessmentId: string, updates: Partial<Assessment>) {
    try {
        const { data, error } = await supabase
            .from('assessments')
            .update(updates)
            .eq('id', assessmentId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Create question with answer options
 */
export async function createQuestion(
    assessmentId: string,
    questionData: Partial<Question>,
    answerOptions?: { text: string; is_correct: boolean }[]
) {
    try {
        // Create question
        const { data: question, error: questionError } = await supabase
            .from('questions')
            .insert({
                ...questionData,
                assessment_id: assessmentId,
            } as Database['public']['Tables']['questions']['Insert'])
            .select()
            .single();

        if (questionError) throw questionError;

        // Create answer options if provided
        if (answerOptions && answerOptions.length > 0) {
            const optionsToInsert = answerOptions.map((option, index) => ({
                question_id: question.id,
                text: option.text,
                is_correct: option.is_correct,
                order_index: index,
            }));

            const { error: optionsError } = await supabase
                .from('answer_options')
                .insert(optionsToInsert);

            if (optionsError) throw optionsError;
        }

        return { success: true, data: question };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete question and its answer options
 */
export async function deleteQuestion(questionId: string) {
    try {
        // Delete answer options first (cascade should handle this, but being explicit)
        await supabase
            .from('answer_options')
            .delete()
            .eq('question_id', questionId);

        // Delete question
        const { error } = await supabase
            .from('questions')
            .delete()
            .eq('id', questionId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update question active status (enable/disable questions in assessment)
 */
export async function updateQuestionActiveStatus(questionId: string, isActive: boolean) {
    try {
        const { data, error } = await supabase
            .from('questions')
            .update({ is_active: isActive })
            .eq('id', questionId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Batch update question active status for an assessment
 */
export async function updateAssessmentQuestions(
    assessmentId: string, 
    activeQuestionIds: string[]
) {
    try {
        // First, get all questions for this assessment
        const { data: allQuestions, error: fetchError } = await supabase
            .from('questions')
            .select('id')
            .eq('assessment_id', assessmentId);

        if (fetchError) throw fetchError;

        // Update all questions: set is_active based on whether they're in activeQuestionIds
        const updates = allQuestions?.map(async (q) => {
            const isActive = activeQuestionIds.includes(q.id);
            return supabase
                .from('questions')
                .update({ is_active: isActive })
                .eq('id', q.id);
        }) || [];

        await Promise.all(updates);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Upload file to storage
 */
export async function uploadFile(
    bucket: string,
    path: string,
    file: File
): Promise<{ success: boolean; data?: { path: string; url: string }; error?: string }> {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;

        // Get public URL for public buckets, signed URL for private buckets
        const isPublicBucket = bucket === 'course-thumbnails' || bucket === 'user-avatars';

        let url: string;
        if (isPublicBucket) {
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);
            url = urlData.publicUrl;
        } else {
            const { data: urlData } = await supabase.storage
                .from(bucket)
                .createSignedUrl(data.path, 3600); // 1 hour expiry
            url = urlData?.signedUrl || '';
        }

        return {
            success: true,
            data: {
                path: data.path,
                url,
            },
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Create asset record
 */
export async function createAsset(assetData: Database['public']['Tables']['assets']['Insert']) {
    try {
        const { data, error } = await supabase
            .from('assets')
            .insert(assetData)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get signed URL for private files
 */
export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) throw error;

        return { success: true, data: data.signedUrl };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get assets for a lesson
 */
export async function getLessonAssets(lessonId: string) {
    try {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('lesson_id', lessonId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Get primary asset for a lesson (video or PDF)
 */
export async function getLessonPrimaryAsset(lessonId: string, type: 'video' | 'pdf') {
    try {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('lesson_id', lessonId)
            .eq('type', type)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update asset
 */
export async function updateAsset(assetId: string, updates: Partial<Database['public']['Tables']['assets']['Update']>) {
    try {
        const { data, error } = await supabase
            .from('assets')
            .update(updates)
            .eq('id', assetId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Delete asset
 */
export async function deleteAsset(assetId: string) {
    try {
        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', assetId);

        if (error) throw error;

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

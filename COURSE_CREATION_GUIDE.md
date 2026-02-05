# Production-Grade Course Creation Guide

## Virtual Film Office Academy - LMS Implementation

This guide covers the complete course creation flow, backend integration, learner access, and all related features for a production-ready learning management system.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Database Schema](#2-database-schema)
3. [Course Creation Flow](#3-course-creation-flow)
4. [File Upload System](#4-file-upload-system)
5. [Assessment & Question System](#5-assessment--question-system)
6. [Learner Access & Enrollment](#6-learner-access--enrollment)
7. [Progress Tracking](#7-progress-tracking)
8. [Implementation Checklist](#8-implementation-checklist)
9. [API Reference](#9-api-reference)
10. [Security Considerations](#10-security-considerations)

---

## 1. Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN PORTAL                                │
├─────────────────────────────────────────────────────────────────────┤
│  Course Creation  │  User Management  │  Analytics  │  Settings     │
└────────┬──────────┴────────┬──────────┴──────┬──────┴───────────────┘
         │                   │                 │
         ▼                   ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                               │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL DB  │  Auth  │  Storage  │  Edge Functions  │  Realtime │
└────────┬────────┴────┬───┴─────┬─────┴────────┬─────────┴───────────┘
         │             │         │              │
         ▼             ▼         ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        LEARNER PORTAL                               │
├─────────────────────────────────────────────────────────────────────┤
│  Course Catalog  │  My Courses  │  Assessments  │  Certificates     │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Admin Creates Course
        │
        ▼
┌───────────────────┐
│   Draft Course    │ ◄─── Auto-save to DB
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Add Weeks       │ ◄─── Ordered modules
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Add Lessons     │ ◄─── Video, PDF, Assessment
└────────┬──────────┘
         │
         ├──────────────────────────────────┐
         ▼                                  ▼
┌───────────────────┐              ┌───────────────────┐
│  Upload Content   │              │ Configure Tests   │
│  (Video/PDF)      │              │ (Questions)       │
└────────┬──────────┘              └────────┬──────────┘
         │                                  │
         └──────────────┬───────────────────┘
                        ▼
               ┌───────────────────┐
               │  Publish Course   │
               └────────┬──────────┘
                        │
                        ▼
               ┌───────────────────┐
               │  Enroll Learners  │
               └────────┬──────────┘
                        │
                        ▼
               ┌───────────────────┐
               │  Learner Access   │
               └───────────────────┘
```

---

## 2. Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   profiles   │       │ course_instructors│       │   courses    │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ instructor_id    │───────►│ id (PK)      │
│ email        │       │ course_id        │       │ title        │
│ full_name    │       │ role             │       │ description  │
│ role         │       └──────────────────┘       │ status       │
│ is_active    │                                  │ created_by   │
└──────────────┘                                  └──────┬───────┘
       │                                                 │
       │                                                 │
       │         ┌───────────────────────────────────────┘
       │         │
       │         ▼
       │  ┌──────────────┐
       │  │    weeks     │
       │  ├──────────────┤
       │  │ id (PK)      │
       │  │ course_id    │
       │  │ title        │
       │  │ order_index  │
       │  └──────┬───────┘
       │         │
       │         ▼
       │  ┌──────────────┐       ┌──────────────┐
       │  │   lessons    │       │    assets    │
       │  ├──────────────┤       ├──────────────┤
       │  │ id (PK)      │───────►│ id (PK)      │
       │  │ week_id      │       │ lesson_id    │
       │  │ title        │       │ file_path    │
       │  │ type         │       │ type         │
       │  │ order_index  │       └──────────────┘
       │  └──────┬───────┘
       │         │
       │         ▼
       │  ┌──────────────┐       ┌──────────────┐       ┌────────────────┐
       │  │ assessments  │       │  questions   │       │ answer_options │
       │  ├──────────────┤       ├──────────────┤       ├────────────────┤
       │  │ id (PK)      │───────►│ id (PK)      │───────►│ id (PK)        │
       │  │ lesson_id    │       │ assessment_id│       │ question_id    │
       │  │ title        │       │ title        │       │ text           │
       │  │ time_limit   │       │ type         │       │ is_correct     │
       │  │ proctoring   │       │ marks        │       └────────────────┘
       │  └──────────────┘       └──────────────┘
       │
       │
       ▼
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│ enrollments  │       │ lesson_progress  │       │ certificates │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │───────►│ id (PK)          │       │ id (PK)      │
│ course_id    │       │ enrollment_id    │       │ enrollment_id│
│ learner_id   │       │ lesson_id        │       │ cert_number  │
│ status       │       │ status           │       │ pdf_url      │
│ progress_%   │       │ progress_%       │       └──────────────┘
└──────────────┘       └──────────────────┘
       │
       ▼
┌────────────────────┐       ┌──────────────────┐
│ assessment_attempts│       │  attempt_answers │
├────────────────────┤       ├──────────────────┤
│ id (PK)            │───────►│ id (PK)          │
│ assessment_id      │       │ attempt_id       │
│ learner_id         │       │ question_id      │
│ score              │       │ answer_text      │
│ status             │       │ is_correct       │
└────────────────────┘       └──────────────────┘
```

### Key Tables Summary

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `courses` | Main course entity | title, status, pricing, level |
| `weeks` | Course modules | course_id, order_index, is_locked |
| `lessons` | Individual content | week_id, type, duration |
| `assets` | Files (video/pdf) | lesson_id, file_path, size |
| `assessments` | Test configuration | lesson_id, time_limit, proctoring |
| `questions` | Test questions | assessment_id, type, marks |
| `answer_options` | MCQ options | question_id, is_correct |
| `enrollments` | Learner enrollment | course_id, learner_id, status |
| `lesson_progress` | Progress tracking | enrollment_id, lesson_id |
| `assessment_attempts` | Test attempts | assessment_id, score, passed |
| `certificates` | Completion certs | enrollment_id, pdf_url |

---

## 3. Course Creation Flow

### Step-by-Step Process

#### Step 1: Initialize Course

```typescript
// Create new course with draft status
const createCourse = async (data: CreateCourseInput) => {
  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      category: data.category,
      level: data.level,
      language: data.language,
      status: 'draft',
      created_by: userId,
    })
    .select()
    .single();
    
  return course;
};
```

#### Step 2: Add Course Metadata

**Required Fields:**
- Title (max 100 chars)
- Description (max 2000 chars)
- Category (from predefined list)
- Level (beginner/intermediate/advanced)
- Language

**Optional Fields:**
- Subtitle
- Thumbnail image
- Preview video
- Learning objectives (array)
- Prerequisites (array)
- Target audience (array)
- Pricing (free/paid with amount)
- Tags (array)

#### Step 3: Create Week Structure

```typescript
// Add week to course
const addWeek = async (courseId: string, data: CreateWeekInput) => {
  // Get current max order
  const { data: maxOrder } = await supabase
    .from('weeks')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();
    
  const newOrder = (maxOrder?.order_index ?? -1) + 1;
  
  const { data: week, error } = await supabase
    .from('weeks')
    .insert({
      course_id: courseId,
      title: data.title,
      description: data.description,
      order_index: newOrder,
      is_locked: data.isLocked ?? false,
    })
    .select()
    .single();
    
  return week;
};
```

#### Step 4: Add Lessons to Weeks

```typescript
// Add lesson to week
const addLesson = async (weekId: string, data: CreateLessonInput) => {
  // Get current max order within week
  const { data: maxOrder } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('week_id', weekId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();
    
  const newOrder = (maxOrder?.order_index ?? -1) + 1;
  
  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      week_id: weekId,
      title: data.title,
      description: data.description,
      type: data.type, // 'video' | 'pdf' | 'assessment'
      order_index: newOrder,
      is_preview: data.isPreview ?? false,
    })
    .select()
    .single();
    
  // If assessment type, create assessment config
  if (data.type === 'assessment') {
    await createAssessment(lesson.id, data.assessmentConfig);
  }
  
  return lesson;
};
```

#### Step 5: Upload Content

See [Section 4: File Upload System](#4-file-upload-system)

#### Step 6: Configure Assessments

See [Section 5: Assessment & Question System](#5-assessment--question-system)

#### Step 7: Validate & Publish

```typescript
// Validation before publishing
const validateCourse = async (courseId: string): Promise<ValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Fetch complete course data
  const course = await getCourseWithContent(courseId);
  
  // Required validations
  if (!course.title) errors.push('Course title is required');
  if (!course.description) errors.push('Course description is required');
  if (!course.category) errors.push('Course category is required');
  if (course.weeks.length === 0) errors.push('At least one week is required');
  
  // Content validations
  let totalLessons = 0;
  let lessonsWithContent = 0;
  
  for (const week of course.weeks) {
    if (week.lessons.length === 0) {
      warnings.push(`Week "${week.title}" has no lessons`);
    }
    
    for (const lesson of week.lessons) {
      totalLessons++;
      
      if (lesson.type === 'video' || lesson.type === 'pdf') {
        if (lesson.assets.length > 0) {
          lessonsWithContent++;
        } else {
          errors.push(`Lesson "${lesson.title}" has no content uploaded`);
        }
      }
      
      if (lesson.type === 'assessment') {
        if (!lesson.assessment) {
          errors.push(`Assessment "${lesson.title}" is not configured`);
        } else if (lesson.assessment.questions.length === 0) {
          errors.push(`Assessment "${lesson.title}" has no questions`);
        }
      }
    }
  }
  
  if (totalLessons === 0) {
    errors.push('Course must have at least one lesson');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalWeeks: course.weeks.length,
      totalLessons,
      lessonsWithContent,
    }
  };
};

// Publish course
const publishCourse = async (courseId: string) => {
  const validation = await validateCourse(courseId);
  
  if (!validation.isValid) {
    throw new Error(`Cannot publish: ${validation.errors.join(', ')}`);
  }
  
  const { data, error } = await supabase
    .from('courses')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', courseId)
    .select()
    .single();
    
  return data;
};
```

### Course States

```
┌─────────┐     Publish     ┌───────────┐     Archive     ┌──────────┐
│  DRAFT  │ ───────────────►│ PUBLISHED │ ───────────────►│ ARCHIVED │
└─────────┘                 └───────────┘                 └──────────┘
     ▲                            │                            │
     │                            │ Unpublish                  │
     │                            ▼                            │
     └────────────────────────────┴────────────────────────────┘
                              Restore
```

---

## 4. File Upload System

### Storage Buckets Configuration

| Bucket | Purpose | Max Size | Allowed Types | Access |
|--------|---------|----------|---------------|--------|
| `course-thumbnails` | Course images | 5MB | jpeg, png, webp | Public |
| `course-videos` | Lesson videos | 500MB | mp4, webm, mov | Enrolled only |
| `course-pdfs` | Lesson documents | 50MB | pdf | Enrolled only |
| `user-avatars` | Profile pictures | 2MB | jpeg, png, webp | Public |
| `certificates` | Completion certs | 5MB | pdf | Owner only |

### File Upload Flow

```
┌─────────────────┐
│  Select File    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate       │ ◄─── Size, Type, Dimensions
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Generate Path  │ ◄─── {course_id}/{lesson_id}/{uuid}.{ext}
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Upload to      │
│  Supabase       │ ◄─── With progress tracking
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create Asset   │ ◄─── Store metadata in DB
│  Record         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update Lesson  │ ◄─── Link asset to lesson
└─────────────────┘
```

### Upload Implementation

```typescript
// File validation
const validateFile = (file: File, type: 'video' | 'pdf' | 'image'): ValidationResult => {
  const limits = {
    video: { maxSize: 500 * 1024 * 1024, types: ['video/mp4', 'video/webm', 'video/quicktime'] },
    pdf: { maxSize: 50 * 1024 * 1024, types: ['application/pdf'] },
    image: { maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
  };
  
  const limit = limits[type];
  
  if (file.size > limit.maxSize) {
    return { valid: false, error: `File too large. Max: ${limit.maxSize / 1024 / 1024}MB` };
  }
  
  if (!limit.types.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${limit.types.join(', ')}` };
  }
  
  return { valid: true };
};

// Upload with progress
const uploadFile = async (
  file: File,
  courseId: string,
  lessonId: string,
  onProgress: (progress: number) => void
): Promise<UploadResult> => {
  const bucket = file.type.startsWith('video/') ? 'course-videos' : 'course-pdfs';
  const ext = file.name.split('.').pop();
  const path = `${courseId}/${lessonId}/${crypto.randomUUID()}.${ext}`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      // Note: Supabase JS doesn't support progress natively
      // Use XMLHttpRequest for progress tracking
    });
    
  if (error) throw error;
  
  // Create asset record
  const { data: asset, error: assetError } = await supabase
    .from('assets')
    .insert({
      lesson_id: lessonId,
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'pdf',
      file_path: path,
      file_size_bytes: file.size,
      mime_type: file.type,
    })
    .select()
    .single();
    
  if (assetError) throw assetError;
  
  return { asset, path };
};

// Get signed URL for playback (enrolled users only)
const getAssetUrl = async (assetPath: string, bucket: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(assetPath, 3600); // 1 hour expiry
    
  if (error) throw error;
  return data.signedUrl;
};
```

### Video Processing (Optional Enhancement)

For production, consider:
1. **Transcoding**: Convert to multiple qualities (360p, 720p, 1080p)
2. **HLS Streaming**: Adaptive bitrate streaming
3. **Thumbnail Generation**: Auto-generate video thumbnails
4. **Duration Extraction**: Get video length automatically

```typescript
// Using Supabase Edge Function for video processing
const processVideo = async (videoPath: string) => {
  const { data, error } = await supabase.functions.invoke('process-video', {
    body: { videoPath }
  });
  
  return data; // { duration, thumbnail, qualities: [...] }
};
```

---

## 5. Assessment & Question System

### Assessment Types

| Type | Purpose | Time Limit | Attempts | Auto-Grade |
|------|---------|------------|----------|------------|
| `quiz` | Quick knowledge check | Optional | Unlimited | Yes |
| `exam` | Formal evaluation | Required | Limited | Partial |
| `practice` | Self-study | None | Unlimited | Yes |

### Question Types

| Type | Description | Auto-Gradable |
|------|-------------|---------------|
| `multiple_choice` | Single correct answer | Yes |
| `true_false` | True/False selection | Yes |
| `short_answer` | Text input (keyword match) | Partial |
| `essay` | Long-form response | No |

### Assessment Configuration

```typescript
interface AssessmentConfig {
  // Basic Settings
  title: string;
  description?: string;
  type: 'quiz' | 'exam' | 'practice';
  
  // Time & Attempts
  timeLimitMinutes?: number;      // null = unlimited
  maxAttempts: number;            // -1 = unlimited
  
  // Scoring
  passingScorePercentage: number; // 0-100
  totalMarks: number;             // Auto-calculated from questions
  
  // Display Options
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: 'immediately' | 'after_submission' | 'after_due_date' | 'never';
  showCorrectAnswers: boolean;
  
  // Proctoring (for exams)
  proctoring: {
    enabled: boolean;
    copyPasteAllowed: boolean;
    rightClickAllowed: boolean;
    printAllowed: boolean;
    devToolsAllowed: boolean;
    tabSwitchingAllowed: boolean;
    maxTabSwitches?: number;
  };
}
```

### Question Structure

```typescript
interface Question {
  id: string;
  assessmentId: string;
  
  // Content
  title: string;                  // The question text
  description?: string;           // Additional context/instructions
  
  // Classification
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;              // e.g., "Film Production"
  topic?: string;                 // e.g., "Cinematography"
  subtopic?: string;              // e.g., "Lighting Techniques"
  
  // Scoring
  marks: number;
  durationSeconds?: number;       // Suggested time per question
  
  // Answer
  options?: AnswerOption[];       // For MCQ/True-False
  correctAnswer?: string;         // For short answer (keyword)
  explanation?: string;           // Shown after submission
  
  // Ordering
  orderIndex: number;
}

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  orderIndex: number;
}
```

### Creating Questions

```typescript
// Add question to assessment
const addQuestion = async (assessmentId: string, data: CreateQuestionInput) => {
  // Get current max order
  const { data: maxOrder } = await supabase
    .from('questions')
    .select('order_index')
    .eq('assessment_id', assessmentId)
    .order('order_index', { ascending: false })
    .limit(1)
    .single();
    
  const newOrder = (maxOrder?.order_index ?? -1) + 1;
  
  // Create question
  const { data: question, error } = await supabase
    .from('questions')
    .insert({
      assessment_id: assessmentId,
      title: data.title,
      description: data.description,
      type: data.type,
      difficulty: data.difficulty,
      marks: data.marks,
      category: data.category,
      topic: data.topic,
      subtopic: data.subtopic,
      explanation: data.explanation,
      order_index: newOrder,
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Add answer options (for MCQ/True-False)
  if (data.options && data.options.length > 0) {
    const optionsToInsert = data.options.map((opt, idx) => ({
      question_id: question.id,
      text: opt.text,
      is_correct: opt.isCorrect,
      order_index: idx,
    }));
    
    await supabase
      .from('answer_options')
      .insert(optionsToInsert);
  }
  
  // Update assessment total marks
  await updateAssessmentTotalMarks(assessmentId);
  
  return question;
};

// Update total marks
const updateAssessmentTotalMarks = async (assessmentId: string) => {
  const { data: questions } = await supabase
    .from('questions')
    .select('marks')
    .eq('assessment_id', assessmentId);
    
  const totalMarks = questions?.reduce((sum, q) => sum + q.marks, 0) ?? 0;
  
  await supabase
    .from('assessments')
    .update({ total_marks: totalMarks })
    .eq('id', assessmentId);
};
```

### Question Bank (Future Enhancement)

```typescript
// Import questions from bank
const importFromQuestionBank = async (
  assessmentId: string,
  filters: {
    category?: string;
    topic?: string;
    difficulty?: string;
    count: number;
    random?: boolean;
  }
) => {
  // Query question bank
  let query = supabase
    .from('question_bank')
    .select('*');
    
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.topic) query = query.eq('topic', filters.topic);
  if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);
  
  if (filters.random) {
    // Use PostgreSQL random ordering
    query = query.order('random()').limit(filters.count);
  } else {
    query = query.limit(filters.count);
  }
  
  const { data: questions } = await query;
  
  // Copy questions to assessment
  for (const q of questions) {
    await addQuestion(assessmentId, q);
  }
};
```

---

## 6. Learner Access & Enrollment

### Enrollment Flow

```
Admin/System                           Learner
     │                                    │
     │  1. Create Enrollment              │
     ├───────────────────────────────────►│
     │                                    │
     │                                    │  2. Access Course
     │◄───────────────────────────────────┤
     │                                    │
     │  3. Initialize Progress            │
     ├───────────────────────────────────►│
     │                                    │
     │                                    │  4. View Content
     │                                    │  5. Complete Lessons
     │                                    │  6. Take Assessments
     │◄───────────────────────────────────┤
     │                                    │
     │  7. Track Progress                 │
     │  8. Issue Certificate              │
     ├───────────────────────────────────►│
     │                                    │
```

### Enrollment Implementation

```typescript
// Enroll learner in course
const enrollLearner = async (
  courseId: string,
  learnerId: string,
  enrolledBy: string
): Promise<Enrollment> => {
  // Check if already enrolled
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('course_id', courseId)
    .eq('learner_id', learnerId)
    .single();
    
  if (existing) {
    if (existing.status === 'active') {
      throw new Error('Learner is already enrolled in this course');
    }
    // Reactivate if dropped/suspended
    const { data } = await supabase
      .from('enrollments')
      .update({ status: 'active', enrolled_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single();
    return data;
  }
  
  // Create new enrollment
  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .insert({
      course_id: courseId,
      learner_id: learnerId,
      enrolled_by: enrolledBy,
      status: 'active',
      progress_percentage: 0,
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Initialize lesson progress records
  await initializeLessonProgress(enrollment.id, courseId);
  
  return enrollment;
};

// Initialize progress for all lessons
const initializeLessonProgress = async (enrollmentId: string, courseId: string) => {
  // Get all lessons in course
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, weeks!inner(course_id)')
    .eq('weeks.course_id', courseId);
    
  if (!lessons || lessons.length === 0) return;
  
  // Create progress records
  const progressRecords = lessons.map(lesson => ({
    enrollment_id: enrollmentId,
    lesson_id: lesson.id,
    status: 'not_started',
    progress_percentage: 0,
    time_spent_seconds: 0,
  }));
  
  await supabase
    .from('lesson_progress')
    .insert(progressRecords);
};
```

### Bulk Enrollment

```typescript
// Enroll multiple learners
const bulkEnroll = async (
  courseId: string,
  learnerIds: string[],
  enrolledBy: string
): Promise<BulkEnrollResult> => {
  const results = {
    successful: [] as string[],
    failed: [] as { learnerId: string; error: string }[],
    alreadyEnrolled: [] as string[],
  };
  
  for (const learnerId of learnerIds) {
    try {
      await enrollLearner(courseId, learnerId, enrolledBy);
      results.successful.push(learnerId);
    } catch (error) {
      if (error.message.includes('already enrolled')) {
        results.alreadyEnrolled.push(learnerId);
      } else {
        results.failed.push({ learnerId, error: error.message });
      }
    }
  }
  
  return results;
};
```

### Access Control

```typescript
// Check if learner can access lesson
const canAccessLesson = async (
  learnerId: string,
  lessonId: string
): Promise<{ canAccess: boolean; reason?: string }> => {
  // Get lesson with week and course info
  const { data: lesson } = await supabase
    .from('lessons')
    .select(`
      id,
      is_preview,
      weeks!inner (
        id,
        is_locked,
        unlock_date,
        order_index,
        courses!inner (
          id,
          status
        )
      )
    `)
    .eq('id', lessonId)
    .single();
    
  if (!lesson) {
    return { canAccess: false, reason: 'Lesson not found' };
  }
  
  // Preview lessons are always accessible
  if (lesson.is_preview) {
    return { canAccess: true };
  }
  
  // Course must be published
  if (lesson.weeks.courses.status !== 'published') {
    return { canAccess: false, reason: 'Course is not available' };
  }
  
  // Check enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('course_id', lesson.weeks.courses.id)
    .eq('learner_id', learnerId)
    .eq('status', 'active')
    .single();
    
  if (!enrollment) {
    return { canAccess: false, reason: 'Not enrolled in this course' };
  }
  
  // Check if week is locked
  if (lesson.weeks.is_locked) {
    return { canAccess: false, reason: 'This week is locked' };
  }
  
  // Check unlock date
  if (lesson.weeks.unlock_date && new Date(lesson.weeks.unlock_date) > new Date()) {
    return { canAccess: false, reason: `Available from ${lesson.weeks.unlock_date}` };
  }
  
  return { canAccess: true };
};
```

---

## 7. Progress Tracking

### Progress Update Flow

```
Learner Action                    System Response
      │                                 │
      │  Watch Video                    │
      ├────────────────────────────────►│
      │                                 │  Update time_spent
      │                                 │  Update last_position
      │                                 │  Update progress %
      │                                 │
      │  Complete Lesson                │
      ├────────────────────────────────►│
      │                                 │  Mark lesson complete
      │                                 │  Update enrollment %
      │                                 │  Check course completion
      │                                 │
      │  Submit Assessment              │
      ├────────────────────────────────►│
      │                                 │  Grade answers
      │                                 │  Record attempt
      │                                 │  Update progress
      │                                 │
```

### Progress Implementation

```typescript
// Update lesson progress
const updateLessonProgress = async (
  enrollmentId: string,
  lessonId: string,
  update: {
    progressPercentage?: number;
    timeSpentSeconds?: number;
    lastPositionSeconds?: number;
    status?: 'not_started' | 'in_progress' | 'completed';
  }
) => {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };
  
  if (update.progressPercentage !== undefined) {
    updateData.progress_percentage = update.progressPercentage;
  }
  
  if (update.timeSpentSeconds !== undefined) {
    // Increment time spent
    updateData.time_spent_seconds = supabase.rpc('increment', {
      row_id: lessonId,
      amount: update.timeSpentSeconds,
    });
  }
  
  if (update.lastPositionSeconds !== undefined) {
    updateData.last_position_seconds = update.lastPositionSeconds;
  }
  
  if (update.status) {
    updateData.status = update.status;
    if (update.status === 'in_progress' && !updateData.started_at) {
      updateData.started_at = new Date().toISOString();
    }
    if (update.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
      updateData.progress_percentage = 100;
    }
  }
  
  await supabase
    .from('lesson_progress')
    .update(updateData)
    .eq('enrollment_id', enrollmentId)
    .eq('lesson_id', lessonId);
    
  // Recalculate enrollment progress
  await updateEnrollmentProgress(enrollmentId);
};

// Calculate and update enrollment progress
const updateEnrollmentProgress = async (enrollmentId: string) => {
  // Get all lesson progress for this enrollment
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('progress_percentage')
    .eq('enrollment_id', enrollmentId);
    
  if (!progress || progress.length === 0) return;
  
  // Calculate average progress
  const totalProgress = progress.reduce((sum, p) => sum + p.progress_percentage, 0);
  const averageProgress = Math.round(totalProgress / progress.length);
  
  // Check if all lessons completed
  const allCompleted = progress.every(p => p.progress_percentage === 100);
  
  const updateData: any = {
    progress_percentage: averageProgress,
    last_accessed_at: new Date().toISOString(),
  };
  
  if (allCompleted) {
    updateData.status = 'completed';
    updateData.completed_at = new Date().toISOString();
  }
  
  await supabase
    .from('enrollments')
    .update(updateData)
    .eq('id', enrollmentId);
    
  // Issue certificate if completed
  if (allCompleted) {
    await issueCertificate(enrollmentId);
  }
};
```

### Video Progress Tracking

```typescript
// Track video progress (call periodically during playback)
const trackVideoProgress = async (
  enrollmentId: string,
  lessonId: string,
  currentTime: number,
  duration: number
) => {
  const progressPercentage = Math.round((currentTime / duration) * 100);
  
  await updateLessonProgress(enrollmentId, lessonId, {
    progressPercentage: Math.min(progressPercentage, 100),
    lastPositionSeconds: Math.round(currentTime),
    timeSpentSeconds: 5, // Increment by 5 seconds (call every 5s)
    status: progressPercentage >= 90 ? 'completed' : 'in_progress',
  });
};
```

---

## 8. Implementation Checklist

### Phase 1: Core Backend Integration

- [ ] **Course Service Integration**
  - [ ] Replace localStorage with Supabase calls
  - [ ] Implement `createCourse()` with proper error handling
  - [ ] Implement `updateCourse()` with optimistic updates
  - [ ] Implement `getCourse()` with full relations
  - [ ] Implement `deleteCourse()` (soft delete/archive)
  - [ ] Add course listing with pagination and filters

- [ ] **Week Management**
  - [ ] Implement `addWeek()` with order management
  - [ ] Implement `updateWeek()` for title/description
  - [ ] Implement `deleteWeek()` with cascade handling
  - [ ] Implement `reorderWeeks()` for drag-and-drop

- [ ] **Lesson Management**
  - [ ] Implement `addLesson()` with type handling
  - [ ] Implement `updateLesson()` for properties
  - [ ] Implement `deleteLesson()` with asset cleanup
  - [ ] Implement `reorderLessons()` within week

### Phase 2: File Upload System

- [ ] **Upload Infrastructure**
  - [ ] Create upload service with progress tracking
  - [ ] Implement file validation (size, type)
  - [ ] Generate unique file paths
  - [ ] Handle upload errors gracefully

- [ ] **Video Uploads**
  - [ ] Upload to `course-videos` bucket
  - [ ] Extract video duration (client-side or edge function)
  - [ ] Generate thumbnail (optional)
  - [ ] Create asset record in database

- [ ] **PDF Uploads**
  - [ ] Upload to `course-pdfs` bucket
  - [ ] Get page count (optional)
  - [ ] Create asset record in database

- [ ] **Thumbnail/Image Uploads**
  - [ ] Upload to `course-thumbnails` bucket
  - [ ] Resize/optimize images
  - [ ] Update course record

### Phase 3: Assessment System

- [ ] **Assessment Configuration**
  - [ ] Create assessment when lesson type is 'assessment'
  - [ ] Update assessment settings
  - [ ] Configure proctoring options
  - [ ] Set time limits and attempts

- [ ] **Question Management**
  - [ ] Implement `addQuestion()` with options
  - [ ] Implement `updateQuestion()` for editing
  - [ ] Implement `deleteQuestion()` with cleanup
  - [ ] Implement `reorderQuestions()`
  - [ ] Support all question types (MCQ, T/F, short, essay)

- [ ] **Answer Options**
  - [ ] Add/update/delete options for MCQ
  - [ ] Mark correct answer(s)
  - [ ] Reorder options

### Phase 4: Course Details & Settings

- [ ] **Course Details Tab**
  - [ ] Category selection (dropdown)
  - [ ] Tags input (multi-select/chips)
  - [ ] Level selection
  - [ ] Language selection
  - [ ] Thumbnail upload
  - [ ] Preview video upload
  - [ ] Learning objectives (list editor)
  - [ ] Prerequisites (list editor)
  - [ ] Target audience (list editor)
  - [ ] Instructor assignment

- [ ] **Settings Tab**
  - [ ] Pricing configuration (free/paid)
  - [ ] Enrollment settings (open/restricted)
  - [ ] Certificate settings
  - [ ] Notification settings
  - [ ] SEO settings (meta description, OG image)

### Phase 5: Validation & Publishing

- [ ] **Validation System**
  - [ ] Required field validation
  - [ ] Content completeness check
  - [ ] Assessment completeness check
  - [ ] Display validation errors/warnings

- [ ] **Publishing Flow**
  - [ ] Pre-publish validation
  - [ ] Publish confirmation dialog
  - [ ] Publish to database
  - [ ] Unpublish option
  - [ ] Archive option

### Phase 6: Learner Access

- [ ] **Enrollment System**
  - [ ] Single learner enrollment
  - [ ] Bulk enrollment
  - [ ] Enrollment status management
  - [ ] Progress initialization

- [ ] **Content Access**
  - [ ] Signed URL generation for videos
  - [ ] PDF viewer integration
  - [ ] Access control enforcement
  - [ ] Preview lesson handling

- [ ] **Progress Tracking**
  - [ ] Video progress tracking
  - [ ] Lesson completion
  - [ ] Course progress calculation
  - [ ] Resume from last position

### Phase 7: Assessment Taking

- [ ] **Assessment UI**
  - [ ] Question display
  - [ ] Answer selection/input
  - [ ] Timer display
  - [ ] Navigation between questions
  - [ ] Submit confirmation

- [ ] **Proctoring**
  - [ ] Tab switch detection
  - [ ] Copy/paste prevention
  - [ ] Right-click prevention
  - [ ] Violation logging

- [ ] **Grading**
  - [ ] Auto-grade MCQ/T-F
  - [ ] Manual grading UI for essays
  - [ ] Score calculation
  - [ ] Results display

### Phase 8: Certificates

- [ ] **Certificate Generation**
  - [ ] Completion detection
  - [ ] PDF generation
  - [ ] Unique certificate number
  - [ ] Verification code

- [ ] **Certificate Verification**
  - [ ] Public verification page
  - [ ] QR code generation

---

## 9. API Reference

### Course Endpoints

```typescript
// Course CRUD
createCourse(data: CreateCourseInput): Promise<Course>
getCourse(id: string): Promise<CourseWithContent>
updateCourse(id: string, data: UpdateCourseInput): Promise<Course>
deleteCourse(id: string): Promise<void>
listCourses(filters: CourseFilters): Promise<PaginatedCourses>
publishCourse(id: string): Promise<Course>
archiveCourse(id: string): Promise<Course>

// Week Management
addWeek(courseId: string, data: CreateWeekInput): Promise<Week>
updateWeek(id: string, data: UpdateWeekInput): Promise<Week>
deleteWeek(id: string): Promise<void>
reorderWeeks(courseId: string, weekIds: string[]): Promise<void>

// Lesson Management
addLesson(weekId: string, data: CreateLessonInput): Promise<Lesson>
updateLesson(id: string, data: UpdateLessonInput): Promise<Lesson>
deleteLesson(id: string): Promise<void>
reorderLessons(weekId: string, lessonIds: string[]): Promise<void>

// Asset Management
uploadAsset(lessonId: string, file: File): Promise<Asset>
deleteAsset(id: string): Promise<void>
getAssetUrl(id: string): Promise<string>

// Assessment Management
createAssessment(lessonId: string, data: AssessmentConfig): Promise<Assessment>
updateAssessment(id: string, data: AssessmentConfig): Promise<Assessment>
addQuestion(assessmentId: string, data: CreateQuestionInput): Promise<Question>
updateQuestion(id: string, data: UpdateQuestionInput): Promise<Question>
deleteQuestion(id: string): Promise<void>
reorderQuestions(assessmentId: string, questionIds: string[]): Promise<void>

// Enrollment
enrollLearner(courseId: string, learnerId: string): Promise<Enrollment>
bulkEnroll(courseId: string, learnerIds: string[]): Promise<BulkEnrollResult>
updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<Enrollment>
getEnrollments(courseId: string): Promise<Enrollment[]>

// Progress
updateLessonProgress(enrollmentId: string, lessonId: string, data: ProgressUpdate): Promise<void>
getLearnerProgress(learnerId: string, courseId: string): Promise<CourseProgress>

// Assessment Attempts
startAttempt(assessmentId: string): Promise<AssessmentAttempt>
submitAnswer(attemptId: string, questionId: string, answer: Answer): Promise<void>
submitAttempt(attemptId: string): Promise<AttemptResult>
getAttemptResults(attemptId: string): Promise<AttemptResult>
```

---

## 10. Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- **Courses**: Admins can manage, learners see published only
- **Content**: Enrolled learners can view, admins can manage
- **Progress**: Learners manage their own, admins view all
- **Assessments**: Learners can attempt, admins can grade

### File Access Control

- **Videos/PDFs**: Signed URLs with 1-hour expiry
- **Path-based access**: `{course_id}/{lesson_id}/` structure
- **Enrollment check**: Verify enrollment before URL generation

### Input Validation

```typescript
// Server-side validation (Edge Function or API route)
const validateCourseInput = (data: CreateCourseInput) => {
  const errors: string[] = [];
  
  if (!data.title || data.title.length > 100) {
    errors.push('Title is required and must be under 100 characters');
  }
  
  if (data.description && data.description.length > 2000) {
    errors.push('Description must be under 2000 characters');
  }
  
  // Sanitize HTML content
  if (data.description) {
    data.description = sanitizeHtml(data.description);
  }
  
  return { valid: errors.length === 0, errors, data };
};
```

### Rate Limiting

Consider implementing rate limits for:
- File uploads: 10 per minute
- Assessment submissions: 1 per 30 seconds
- API calls: 100 per minute

### Audit Logging

Log important actions:
- Course creation/publishing
- Enrollment changes
- Assessment attempts
- File uploads/deletions

---

## Quick Start Commands

### 1. Generate Supabase Types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

### 2. Create Storage Buckets (if not exists)

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('course-thumbnails', 'course-thumbnails', true),
  ('course-videos', 'course-videos', false),
  ('course-pdfs', 'course-pdfs', false),
  ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;
```

### 3. Test RLS Policies

```sql
-- Test as a specific user
SET request.jwt.claim.sub = 'user-uuid-here';
SET request.jwt.claim.role = 'authenticated';

-- Try to select courses
SELECT * FROM courses WHERE status = 'published';
```

---

## Summary

This guide covers the complete course creation and management system for the Virtual Film Office Academy. The implementation follows a phased approach:

1. **Phase 1-2**: Core backend and file uploads
2. **Phase 3-4**: Assessments and course details
3. **Phase 5-6**: Publishing and learner access
4. **Phase 7-8**: Assessment taking and certificates

Each phase builds on the previous, allowing for incremental development and testing. The database schema supports all required features, and the RLS policies ensure proper access control.

**Next Steps:**
1. Start with Phase 1: Replace localStorage with Supabase
2. Implement file uploads (Phase 2)
3. Complete the assessment system (Phase 3)
4. Build out remaining features incrementally

For questions or clarifications, refer to the Supabase documentation or the existing service files in `lib/services/`.

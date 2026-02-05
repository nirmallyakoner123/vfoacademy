-- ============================================
-- Row Level Security (RLS) Policies
-- Virtual Film Office Academy
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (is_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Only super admins can insert profiles (via admin panel)
CREATE POLICY "Super admins can create profiles"
ON profiles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- ============================================
-- COURSES POLICIES
-- ============================================

-- Published courses are visible to all authenticated users
CREATE POLICY "Published courses visible to authenticated users"
ON courses FOR SELECT
USING (
  status = 'published' AND auth.role() = 'authenticated'
);

-- Admins can view all courses
CREATE POLICY "Admins can view all courses"
ON courses FOR SELECT
USING (is_admin(auth.uid()));

-- Admins can create courses
CREATE POLICY "Admins can create courses"
ON courses FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Course creators and admins can update courses
CREATE POLICY "Creators and admins can update courses"
ON courses FOR UPDATE
USING (
  created_by = auth.uid() OR is_admin(auth.uid())
);

-- Only super admins can delete courses
CREATE POLICY "Super admins can delete courses"
ON courses FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- ============================================
-- COURSE INSTRUCTORS POLICIES
-- ============================================

-- Admins can manage course instructors
CREATE POLICY "Admins can view course instructors"
ON course_instructors FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can add course instructors"
ON course_instructors FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can remove course instructors"
ON course_instructors FOR DELETE
USING (is_admin(auth.uid()));

-- ============================================
-- WEEKS POLICIES
-- ============================================

-- Enrolled learners can view weeks of their courses
CREATE POLICY "Enrolled learners can view course weeks"
ON weeks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.course_id = weeks.course_id
    AND e.learner_id = auth.uid()
    AND e.status = 'active'
  )
  OR is_admin(auth.uid())
);

-- Admins can manage weeks
CREATE POLICY "Admins can create weeks"
ON weeks FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update weeks"
ON weeks FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete weeks"
ON weeks FOR DELETE
USING (is_admin(auth.uid()));

-- ============================================
-- LESSONS POLICIES
-- ============================================

-- Enrolled learners can view lessons
CREATE POLICY "Enrolled learners can view lessons"
ON lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM weeks w
    JOIN enrollments e ON e.course_id = w.course_id
    WHERE w.id = lessons.week_id
    AND e.learner_id = auth.uid()
    AND e.status = 'active'
  )
  OR is_preview = true
  OR is_admin(auth.uid())
);

-- Admins can manage lessons
CREATE POLICY "Admins can create lessons"
ON lessons FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update lessons"
ON lessons FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete lessons"
ON lessons FOR DELETE
USING (is_admin(auth.uid()));

-- ============================================
-- ASSETS POLICIES
-- ============================================

-- Enrolled learners can view assets
CREATE POLICY "Enrolled learners can view assets"
ON assets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM lessons l
    JOIN weeks w ON w.id = l.week_id
    JOIN enrollments e ON e.course_id = w.course_id
    WHERE l.id = assets.lesson_id
    AND e.learner_id = auth.uid()
    AND e.status = 'active'
  )
  OR is_admin(auth.uid())
);

-- Admins can manage assets
CREATE POLICY "Admins can upload assets"
ON assets FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete assets"
ON assets FOR DELETE
USING (is_admin(auth.uid()));

-- ============================================
-- ASSESSMENTS POLICIES
-- ============================================

-- Enrolled learners can view assessments
CREATE POLICY "Enrolled learners can view assessments"
ON assessments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM lessons l
    JOIN weeks w ON w.id = l.week_id
    JOIN enrollments e ON e.course_id = w.course_id
    WHERE l.id = assessments.lesson_id
    AND e.learner_id = auth.uid()
    AND e.status = 'active'
  )
  OR is_admin(auth.uid())
);

-- Admins can manage assessments
CREATE POLICY "Admins can create assessments"
ON assessments FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update assessments"
ON assessments FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete assessments"
ON assessments FOR DELETE
USING (is_admin(auth.uid()));

-- ============================================
-- QUESTIONS POLICIES
-- ============================================

-- Enrolled learners can view questions
CREATE POLICY "Enrolled learners can view questions"
ON questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM assessments a
    JOIN lessons l ON l.id = a.lesson_id
    JOIN weeks w ON w.id = l.week_id
    JOIN enrollments e ON e.course_id = w.course_id
    WHERE a.id = questions.assessment_id
    AND e.learner_id = auth.uid()
    AND e.status = 'active'
  )
  OR is_admin(auth.uid())
);

-- Admins can manage questions
CREATE POLICY "Admins can create questions"
ON questions FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update questions"
ON questions FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete questions"
ON questions FOR DELETE
USING (is_admin(auth.uid()));

-- ============================================
-- ANSWER OPTIONS POLICIES
-- ============================================

-- Enrolled learners can view answer options
CREATE POLICY "Enrolled learners can view answer options"
ON answer_options FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM questions q
    JOIN assessments a ON a.id = q.assessment_id
    JOIN lessons l ON l.id = a.lesson_id
    JOIN weeks w ON w.id = l.week_id
    JOIN enrollments e ON e.course_id = w.course_id
    WHERE q.id = answer_options.question_id
    AND e.learner_id = auth.uid()
    AND e.status = 'active'
  )
  OR is_admin(auth.uid())
);

-- Admins can manage answer options
CREATE POLICY "Admins can create answer options"
ON answer_options FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update answer options"
ON answer_options FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete answer options"
ON answer_options FOR DELETE
USING (is_admin(auth.uid()));

-- ============================================
-- ENROLLMENTS POLICIES
-- ============================================

-- Learners can view their own enrollments
CREATE POLICY "Learners can view own enrollments"
ON enrollments FOR SELECT
USING (learner_id = auth.uid());

-- Admins can view all enrollments
CREATE POLICY "Admins can view all enrollments"
ON enrollments FOR SELECT
USING (is_admin(auth.uid()));

-- Admins can create enrollments
CREATE POLICY "Admins can create enrollments"
ON enrollments FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Admins can update enrollments
CREATE POLICY "Admins can update enrollments"
ON enrollments FOR UPDATE
USING (is_admin(auth.uid()));

-- ============================================
-- LESSON PROGRESS POLICIES
-- ============================================

-- Learners can view their own progress
CREATE POLICY "Learners can view own progress"
ON lesson_progress FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.id = lesson_progress.enrollment_id
    AND e.learner_id = auth.uid()
  )
);

-- Learners can update their own progress
CREATE POLICY "Learners can update own progress"
ON lesson_progress FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.id = lesson_progress.enrollment_id
    AND e.learner_id = auth.uid()
  )
);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress"
ON lesson_progress FOR SELECT
USING (is_admin(auth.uid()));

-- System can insert progress records
CREATE POLICY "System can create progress records"
ON lesson_progress FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.id = lesson_progress.enrollment_id
    AND (e.learner_id = auth.uid() OR is_admin(auth.uid()))
  )
);

-- ============================================
-- ASSESSMENT ATTEMPTS POLICIES
-- ============================================

-- Learners can view their own attempts
CREATE POLICY "Learners can view own attempts"
ON assessment_attempts FOR SELECT
USING (learner_id = auth.uid());

-- Learners can create their own attempts
CREATE POLICY "Learners can create attempts"
ON assessment_attempts FOR INSERT
WITH CHECK (learner_id = auth.uid());

-- Learners can update their in-progress attempts
CREATE POLICY "Learners can update own in-progress attempts"
ON assessment_attempts FOR UPDATE
USING (
  learner_id = auth.uid() AND status = 'in_progress'
);

-- Instructors can view attempts for their courses
CREATE POLICY "Instructors can view course attempts"
ON assessment_attempts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM course_instructors ci
    JOIN weeks w ON w.course_id = ci.course_id
    JOIN lessons l ON l.week_id = w.id
    JOIN assessments a ON a.lesson_id = l.id
    WHERE a.id = assessment_attempts.assessment_id
    AND ci.instructor_id = auth.uid()
  )
);

-- Instructors can grade attempts
CREATE POLICY "Instructors can grade attempts"
ON assessment_attempts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM course_instructors ci
    JOIN weeks w ON w.course_id = ci.course_id
    JOIN lessons l ON l.week_id = w.id
    JOIN assessments a ON a.lesson_id = l.id
    WHERE a.id = assessment_attempts.assessment_id
    AND ci.instructor_id = auth.uid()
  )
);

-- Admins can view all attempts
CREATE POLICY "Admins can view all attempts"
ON assessment_attempts FOR SELECT
USING (is_admin(auth.uid()));

-- ============================================
-- ATTEMPT ANSWERS POLICIES
-- ============================================

-- Learners can view their own answers
CREATE POLICY "Learners can view own answers"
ON attempt_answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM assessment_attempts aa
    WHERE aa.id = attempt_answers.attempt_id
    AND aa.learner_id = auth.uid()
  )
);

-- Learners can submit answers for their attempts
CREATE POLICY "Learners can submit answers"
ON attempt_answers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM assessment_attempts aa
    WHERE aa.id = attempt_answers.attempt_id
    AND aa.learner_id = auth.uid()
    AND aa.status = 'in_progress'
  )
);

-- Learners can update their answers during attempt
CREATE POLICY "Learners can update answers during attempt"
ON attempt_answers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM assessment_attempts aa
    WHERE aa.id = attempt_answers.attempt_id
    AND aa.learner_id = auth.uid()
    AND aa.status = 'in_progress'
  )
);

-- Instructors can view answers for grading
CREATE POLICY "Instructors can view answers for grading"
ON attempt_answers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM assessment_attempts aa
    JOIN assessments a ON a.id = aa.assessment_id
    JOIN lessons l ON l.id = a.lesson_id
    JOIN weeks w ON w.id = l.week_id
    JOIN course_instructors ci ON ci.course_id = w.course_id
    WHERE aa.id = attempt_answers.attempt_id
    AND ci.instructor_id = auth.uid()
  )
);

-- Instructors can update answers (for grading)
CREATE POLICY "Instructors can grade answers"
ON attempt_answers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM assessment_attempts aa
    JOIN assessments a ON a.id = aa.assessment_id
    JOIN lessons l ON l.id = a.lesson_id
    JOIN weeks w ON w.id = l.week_id
    JOIN course_instructors ci ON ci.course_id = w.course_id
    WHERE aa.id = attempt_answers.attempt_id
    AND ci.instructor_id = auth.uid()
  )
);

-- Admins can view all answers
CREATE POLICY "Admins can view all answers"
ON attempt_answers FOR SELECT
USING (is_admin(auth.uid()));

-- ============================================
-- CERTIFICATES POLICIES
-- ============================================

-- Learners can view their own certificates
CREATE POLICY "Learners can view own certificates"
ON certificates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM enrollments e
    WHERE e.id = certificates.enrollment_id
    AND e.learner_id = auth.uid()
  )
);

-- Admins can view all certificates
CREATE POLICY "Admins can view all certificates"
ON certificates FOR SELECT
USING (is_admin(auth.uid()));

-- System can create certificates
CREATE POLICY "System can create certificates"
ON certificates FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Anyone can verify certificates (public verification)
CREATE POLICY "Anyone can verify certificates"
ON certificates FOR SELECT
USING (verification_code IS NOT NULL);

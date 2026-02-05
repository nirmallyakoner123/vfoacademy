-- ============================================
-- Virtual Film Office Academy - Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'instructor', 'learner');
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lesson_type AS ENUM ('video', 'pdf', 'assessment');
CREATE TYPE assessment_type AS ENUM ('quiz', 'exam', 'practice');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer', 'essay');
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped', 'suspended');
CREATE TYPE lesson_progress_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'graded', 'expired');
CREATE TYPE show_results AS ENUM ('immediately', 'after_submission', 'after_due_date', 'never');

-- ============================================
-- TABLES
-- ============================================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'learner',
  department TEXT,
  employee_id TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  thumbnail_url TEXT,
  preview_video_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  language TEXT DEFAULT 'English',
  status course_status DEFAULT 'draft',
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  estimated_duration_hours INTEGER,
  learning_objectives TEXT[],
  prerequisites TEXT[],
  target_audience TEXT[],
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Course Instructors
CREATE TABLE course_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('primary', 'assistant')) DEFAULT 'primary',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, instructor_id)
);

-- Weeks
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  unlock_date TIMESTAMPTZ,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type lesson_type NOT NULL,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(week_id, order_index)
);

-- Assets (Videos & PDFs)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('video', 'pdf', 'image')) NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  type assessment_type DEFAULT 'quiz',
  time_limit_minutes INTEGER,
  max_attempts INTEGER DEFAULT 1,
  passing_score_percentage INTEGER DEFAULT 70,
  shuffle_questions BOOLEAN DEFAULT false,
  shuffle_options BOOLEAN DEFAULT false,
  show_results show_results DEFAULT 'immediately',
  show_correct_answers BOOLEAN DEFAULT true,
  evaluation_duration_minutes INTEGER,
  total_marks INTEGER DEFAULT 0,
  proctoring_enabled BOOLEAN DEFAULT false,
  copy_paste_allowed BOOLEAN DEFAULT true,
  right_click_allowed BOOLEAN DEFAULT true,
  print_allowed BOOLEAN DEFAULT true,
  dev_tools_allowed BOOLEAN DEFAULT true,
  tab_switch_limit INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type question_type NOT NULL,
  difficulty difficulty DEFAULT 'medium',
  marks INTEGER NOT NULL,
  duration_minutes INTEGER,
  category TEXT,
  topic TEXT,
  subtopic TEXT,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, order_index)
);

-- Answer Options
CREATE TABLE answer_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, order_index)
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_by UUID REFERENCES profiles(id),
  status enrollment_status DEFAULT 'active',
  progress_percentage INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(course_id, learner_id)
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status lesson_progress_status DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Assessment Attempts
CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL,
  status attempt_status DEFAULT 'in_progress',
  score INTEGER,
  max_score INTEGER,
  percentage DECIMAL(5,2),
  passed BOOLEAN,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES profiles(id),
  feedback TEXT,
  tab_switches INTEGER DEFAULT 0,
  violations JSONB DEFAULT '[]',
  UNIQUE(assessment_id, learner_id, attempt_number)
);

-- Attempt Answers
CREATE TABLE attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  selected_option_id UUID REFERENCES answer_options(id),
  is_correct BOOLEAN,
  marks_awarded INTEGER DEFAULT 0,
  feedback TEXT,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE UNIQUE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  verification_code TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- INDEXES
-- ============================================

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_employee_id ON profiles(employee_id);

-- Courses
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_created_by ON courses(created_by);

-- Course Instructors
CREATE INDEX idx_course_instructors_course ON course_instructors(course_id);
CREATE INDEX idx_course_instructors_instructor ON course_instructors(instructor_id);

-- Weeks
CREATE INDEX idx_weeks_course ON weeks(course_id);
CREATE INDEX idx_weeks_order ON weeks(course_id, order_index);

-- Lessons
CREATE INDEX idx_lessons_week ON lessons(week_id);
CREATE INDEX idx_lessons_type ON lessons(type);

-- Assets
CREATE INDEX idx_assets_lesson ON assets(lesson_id);
CREATE INDEX idx_assets_type ON assets(type);

-- Assessments
CREATE INDEX idx_assessments_lesson ON assessments(lesson_id);
CREATE INDEX idx_assessments_type ON assessments(type);

-- Questions
CREATE INDEX idx_questions_assessment ON questions(assessment_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);

-- Answer Options
CREATE INDEX idx_answer_options_question ON answer_options(question_id);

-- Enrollments
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_learner ON enrollments(learner_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- Lesson Progress
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);

-- Assessment Attempts
CREATE INDEX idx_attempts_assessment ON assessment_attempts(assessment_id);
CREATE INDEX idx_attempts_learner ON assessment_attempts(learner_id);
CREATE INDEX idx_attempts_status ON assessment_attempts(status);

-- Attempt Answers
CREATE INDEX idx_attempt_answers_attempt ON attempt_answers(attempt_id);
CREATE INDEX idx_attempt_answers_question ON attempt_answers(question_id);

-- Certificates
CREATE INDEX idx_certificates_enrollment ON certificates(enrollment_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT role IN ('super_admin', 'admin', 'instructor') 
  FROM profiles 
  WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for courses
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for weeks
CREATE TRIGGER update_weeks_updated_at
  BEFORE UPDATE ON weeks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for lessons
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for assessments
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for questions
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for lesson_progress
CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Storage Buckets and Policies
-- Virtual Film Office Academy
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'course-thumbnails',
    'course-thumbnails',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'course-videos',
    'course-videos',
    false,
    524288000, -- 500MB
    ARRAY['video/mp4', 'video/webm', 'video/quicktime']
  ),
  (
    'course-pdfs',
    'course-pdfs',
    false,
    52428800, -- 50MB
    ARRAY['application/pdf']
  ),
  (
    'user-avatars',
    'user-avatars',
    true,
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'certificates',
    'certificates',
    false,
    5242880, -- 5MB
    ARRAY['application/pdf']
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Course Thumbnails (Public)
CREATE POLICY "Anyone can view course thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

CREATE POLICY "Admins can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-thumbnails' AND
  (SELECT is_admin(auth.uid()))
);

CREATE POLICY "Admins can update course thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-thumbnails' AND
  (SELECT is_admin(auth.uid()))
);

CREATE POLICY "Admins can delete course thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-thumbnails' AND
  (SELECT is_admin(auth.uid()))
);

-- Course Videos (Private - Enrolled only)
CREATE POLICY "Enrolled learners can view course videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-videos' AND
  (
    -- Extract course_id from path: course_id/lesson_id/filename
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.learner_id = auth.uid()
      AND e.status = 'active'
      AND e.course_id::text = split_part(name, '/', 1)
    )
    OR (SELECT is_admin(auth.uid()))
  )
);

CREATE POLICY "Admins can upload course videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-videos' AND
  (SELECT is_admin(auth.uid()))
);

CREATE POLICY "Admins can delete course videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-videos' AND
  (SELECT is_admin(auth.uid()))
);

-- Course PDFs (Private - Enrolled only)
CREATE POLICY "Enrolled learners can view course PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course-pdfs' AND
  (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.learner_id = auth.uid()
      AND e.status = 'active'
      AND e.course_id::text = split_part(name, '/', 1)
    )
    OR (SELECT is_admin(auth.uid()))
  )
);

CREATE POLICY "Admins can upload course PDFs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-pdfs' AND
  (SELECT is_admin(auth.uid()))
);

CREATE POLICY "Admins can delete course PDFs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-pdfs' AND
  (SELECT is_admin(auth.uid()))
);

-- User Avatars (Public)
CREATE POLICY "Anyone can view user avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-avatars' AND
  auth.uid()::text = split_part(name, '/', 1)
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-avatars' AND
  auth.uid()::text = split_part(name, '/', 1)
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-avatars' AND
  auth.uid()::text = split_part(name, '/', 1)
);

-- Certificates (Private - Owner only)
CREATE POLICY "Learners can view their own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates' AND
  (
    auth.uid()::text = split_part(name, '/', 1)
    OR (SELECT is_admin(auth.uid()))
  )
);

CREATE POLICY "System can create certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates' AND
  (SELECT is_admin(auth.uid()))
);

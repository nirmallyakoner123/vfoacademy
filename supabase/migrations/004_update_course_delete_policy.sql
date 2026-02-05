-- Drop the existing strict policy
DROP POLICY IF EXISTS "Super admins can delete courses" ON courses;

-- Create a new policy that allows both super_admin and admin
CREATE POLICY "Admins can delete courses"
ON courses FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  )
);

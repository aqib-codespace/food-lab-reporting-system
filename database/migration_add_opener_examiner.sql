-- Migration: Add Opener and Examiner tracking to reports
-- Date: 2026-01-05

-- Add columns
ALTER TABLE reports
ADD COLUMN opener_id UUID REFERENCES employees(id),
ADD COLUMN examiner_id UUID REFERENCES employees(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_opener_id ON reports(opener_id);
CREATE INDEX IF NOT EXISTS idx_reports_examiner_id ON reports(examiner_id);

-- Migrate existing data
UPDATE reports SET opener_id = employee_id WHERE opener_id IS NULL;

-- Add comments
COMMENT ON COLUMN reports.opener_id IS 'Employee who created/opened the case';
COMMENT ON COLUMN reports.examiner_id IS 'Employee who finalized the case (set from current employee_id when completing)';

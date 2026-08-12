-- Add emailed toggle to va_applications for admin tracking
ALTER TABLE va_applications ADD COLUMN IF NOT EXISTS emailed boolean NOT NULL DEFAULT false;

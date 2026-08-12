-- Add opened_at column to submission tables for admin unread notification tracking.
-- NULL = unread/new, timestamptz = when admin first opened the item.

ALTER TABLE messages ADD COLUMN IF NOT EXISTS opened_at timestamptz;
ALTER TABLE va_seekers ADD COLUMN IF NOT EXISTS opened_at timestamptz;
ALTER TABLE va_applications ADD COLUMN IF NOT EXISTS opened_at timestamptz;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS opened_at timestamptz;

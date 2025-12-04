-- Migration: Rename notification_cooldown_hours to notification_cooldown_seconds
-- The column stores seconds (e.g., 3600 = 1 hour) but was misleadingly named with 'hours'

-- Rename the column
ALTER TABLE endpoints RENAME COLUMN notification_cooldown_hours TO notification_cooldown_seconds;

-- Update the comment to reflect the correct unit
COMMENT ON COLUMN endpoints.notification_cooldown_seconds IS 
  'Seconds to wait before sending duplicate failure notifications. Default: 3600 (1 hour)';

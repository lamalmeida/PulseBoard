
-- Migration: Add notification settings to endpoints
-- Description: Adds consecutive failures, cooldown, recovery notifications, and escalation settings

-- Step 1: Add new columns to endpoints table
ALTER TABLE endpoints
ADD COLUMN IF NOT EXISTS consecutive_failures_threshold INTEGER DEFAULT 2 CHECK (consecutive_failures_threshold BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS notification_cooldown_hours INTEGER DEFAULT 24 CHECK (notification_cooldown_hours > 0),
ADD COLUMN IF NOT EXISTS send_recovery_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS escalation_interval_minutes INTEGER DEFAULT NULL CHECK (escalation_interval_minutes IS NULL OR escalation_interval_minutes > 0);

-- Add helpful comments
COMMENT ON COLUMN endpoints.consecutive_failures_threshold IS 
  'Number of consecutive failures required before sending first alert (1-5). Default: 2';
COMMENT ON COLUMN endpoints.notification_cooldown_hours IS 
  'Hours to wait before sending duplicate failure notifications. Default: 24';
COMMENT ON COLUMN endpoints.send_recovery_notifications IS 
  'Whether to send notification when endpoint recovers from failure. Default: true';
COMMENT ON COLUMN endpoints.escalation_interval_minutes IS 
  'Minutes between repeat alerts during sustained outage. NULL = disabled';

-- Step 2: Modify notifications table
-- First, drop the existing constraint if it exists
ALTER TABLE notifications
DROP CONSTRAINT IF EXISTS notifications_notification_type_check;

-- Update the notification_type column to allow new types
ALTER TABLE notifications
ALTER COLUMN notification_type TYPE TEXT;

-- Add the new constraint with all allowed types
ALTER TABLE notifications
ADD CONSTRAINT notifications_notification_type_check 
CHECK (notification_type IN ('failure', 'recovery', 'escalation'));

-- Add escalation tracking column
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS escalation_count INTEGER DEFAULT 0 CHECK (escalation_count >= 0 AND escalation_count <= 4);

-- Add incident_id to group related notifications
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS incident_id UUID DEFAULT NULL;

-- Add comments for new columns
COMMENT ON COLUMN notifications.escalation_count IS 
  'Number of times this incident has been escalated. Max: 4';
COMMENT ON COLUMN notifications.incident_id IS 
  'Groups related notifications (initial failure, escalations, recovery) for the same incident';

-- Step 3: Create index for faster incident queries
CREATE INDEX IF NOT EXISTS idx_notifications_incident_id 
ON notifications(incident_id) 
WHERE incident_id IS NOT NULL;

-- Create index for escalation queries
CREATE INDEX IF NOT EXISTS idx_notifications_endpoint_type_sent 
ON notifications(endpoint_id, notification_type, sent_at DESC);

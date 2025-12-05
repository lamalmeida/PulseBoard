-- Add status page fields to endpoints table
ALTER TABLE endpoints 
ADD COLUMN slug text UNIQUE,
ADD COLUMN is_public boolean DEFAULT false,
ADD COLUMN public_title text,
ADD COLUMN public_description text;

-- Create an index on slug for faster lookups
CREATE INDEX idx_endpoints_slug ON endpoints(slug);

-- RLS Policies for Public Access
ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public status pages are viewable by everyone" 
ON endpoints FOR SELECT 
USING (is_public = true);

CREATE POLICY "Checks for public endpoints are viewable by everyone"
ON checks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM endpoints
    WHERE endpoints.id = checks.endpoint_id
    AND endpoints.is_public = true
  )
);

-- Create status_pages table
CREATE TABLE status_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create status_page_endpoints junction table
CREATE TABLE status_page_endpoints (
    status_page_id UUID NOT NULL REFERENCES status_pages(id) ON DELETE CASCADE,
    endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (status_page_id, endpoint_id)
);

-- Indexes
CREATE INDEX idx_status_pages_slug ON status_pages(slug);
CREATE INDEX idx_status_pages_user_id ON status_pages(user_id);
CREATE INDEX idx_status_page_endpoints_status_page_id ON status_page_endpoints(status_page_id);
CREATE INDEX idx_status_page_endpoints_endpoint_id ON status_page_endpoints(endpoint_id);

-- RLS Policies

-- status_pages
ALTER TABLE status_pages ENABLE ROW LEVEL SECURITY;

-- Users can view their own status pages
CREATE POLICY "Users can view their own status pages"
ON status_pages FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own status pages
CREATE POLICY "Users can insert their own status pages"
ON status_pages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own status pages
CREATE POLICY "Users can update their own status pages"
ON status_pages FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own status pages
CREATE POLICY "Users can delete their own status pages"
ON status_pages FOR DELETE
USING (auth.uid() = user_id);

-- Public view access for status pages
CREATE POLICY "Public status pages are viewable by everyone"
ON status_pages FOR SELECT
USING (is_public = true);


-- status_page_endpoints
ALTER TABLE status_page_endpoints ENABLE ROW LEVEL SECURITY;

-- Users can view/manage their own status page endpoints (via status_page ownership)
CREATE POLICY "Users can manage endpoints for their status pages"
ON status_page_endpoints FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM status_pages
        WHERE status_pages.id = status_page_endpoints.status_page_id
        AND status_pages.user_id = auth.uid()
    )
);

-- Public view access for status page endpoints
CREATE POLICY "Public status page endpoints are viewable by everyone"
ON status_page_endpoints FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM status_pages
        WHERE status_pages.id = status_page_endpoints.status_page_id
        AND status_pages.is_public = true
    )
);

-- Note: We also need to allow public access to the 'endpoints' table *IF* they are linked to a public status page.
-- The previous policy was:
-- CREATE POLICY "Public status pages are viewable by everyone" ON endpoints FOR SELECT USING (is_public = true);
-- We should Add a new policy or update it to allow access if linked to a public status page.

CREATE POLICY "Endpoints linked to public status pages are viewable by everyone"
ON endpoints FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM status_page_endpoints spe
        JOIN status_pages sp ON sp.id = spe.status_page_id
        WHERE spe.endpoint_id = endpoints.id
        AND sp.is_public = true
    )
);

-- Similarly for checks
CREATE POLICY "Checks for endpoints on public status pages are viewable by everyone"
ON checks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM status_page_endpoints spe
        JOIN status_pages sp ON sp.id = spe.status_page_id
        WHERE spe.endpoint_id = checks.endpoint_id
        AND sp.is_public = true
    )
);

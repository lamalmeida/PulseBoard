-- Remove legacy status page fields from endpoints table
ALTER TABLE endpoints
DROP COLUMN IF EXISTS slug,
DROP COLUMN IF EXISTS is_public,
DROP COLUMN IF EXISTS public_title,
DROP COLUMN IF EXISTS public_description;

-- Drop redundant policies if they exist (though checks policy might still be valid for new system)
-- The old policy "Public status pages are viewable by everyone" on ENDPOINTS relied on is_public column which is gone.
-- So we should drop that old policy.
DROP POLICY IF EXISTS "Public status pages are viewable by everyone" ON endpoints;

-- The policy "Checks for public endpoints are viewable by everyone" on CHECKS relied on endpoints.is_public.
DROP POLICY IF EXISTS "Checks for public endpoints are viewable by everyone" ON checks;

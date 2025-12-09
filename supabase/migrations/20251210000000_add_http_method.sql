ALTER TABLE endpoints
ADD COLUMN http_method TEXT DEFAULT 'GET';
CHECK (http_method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'));

ALTER TABLE endpoints
ADD COLUMN request_headers JSONB DEFAULT '{}';

ALTER TABLE endpoints
ADD COLUMN request_body TEXT;

COMMENT ON COLUMN endpoints.request_body IS 'Body of the request on POST, PUT, PATCH';
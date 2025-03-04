-- name: Give users authenticated access to folder
-- Allowed operation: INSERT, SELECT
-- Target roles: public
((bucket_id = 'avatars'::text) AND (role() = 'authenticated'::text))
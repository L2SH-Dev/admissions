-- name: Admins can do anything
-- Allowed operation: ALL
-- Target roles: authenticated
bucket_id = 'avatars' AND (( SELECT uid() AS uid) IN ( SELECT user_roles.user_id FROM user_roles WHERE (user_roles.role = 'admin'::app_role)))
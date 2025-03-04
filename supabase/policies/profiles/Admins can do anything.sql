-- policy command: ALL
policy "Admins can do anything"
on "public"."profiles"
to authenticated
using (
    (( SELECT uid() AS uid) IN ( SELECT user_roles.user_id FROM user_roles WHERE (user_roles.role = 'admin'::app_role)))
);